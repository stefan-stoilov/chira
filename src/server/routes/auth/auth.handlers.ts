import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { generateState, GitHub } from "arctic";
import { and, eq } from "drizzle-orm";

import { env } from "@/env";
import { db } from "@/server/db";
import { users, refreshTokens } from "@/server/db/schemas";
import { hash, verifyHash } from "@/server/lib/crypto";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./auth.constants";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type {
  OAuthRoute,
  OAuthCallbackRoute,
  SignUpRoute,
  SignInRoute,
  SignOutRoute,
  GetUserRoute,
} from "./auth.routes";
import type { SessionMiddlewareVariables } from "@/server/middlewares/session";

const github = new GitHub(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET, null);

type GithubProfile = {
  name: string;
  id: number;
  email: string;
  avatar_url: string;
  login: string;
};

const SECRET = env.SECRET;

export const oauthHandler: AppRouteHandler<OAuthRoute> = async (c) => {
  const state = generateState();
  const scopes = ["user:email"];

  const url = github.createAuthorizationURL(state, scopes);
  setCookie(c, "github_oauth_state", state, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return c.redirect(url.toString());
};

export const oauthCallbackHandler: AppRouteHandler<OAuthCallbackRoute> = async (
  c,
) => {
  const storedState = getCookie(c, "github_oauth_state");
  const state = c.req.query("state");
  const code = c.req.query("code");

  // validate state
  if (
    typeof code !== "string" ||
    typeof storedState !== "string" ||
    state !== storedState
  ) {
    // TODO: Redirect to OAuth error page
    return c.redirect("/api/auth/health-check");
  }
  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.accessToken()}` },
    });

    const githubUser = (await githubUserResponse.json()) as GithubProfile;
    const { name, id: githubId } = githubUser;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.githubId, githubId));

    let userId = "";
    let userName = "";

    if (!existingUser) {
      const [data] = await db
        .insert(users)
        .values({ name, githubId })
        .returning({ id: users.id, name: users.name });

      userId = data?.id || "";
      userName = data?.name || "";
    } else {
      userId = existingUser.id;
      userName = name;

      await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }

    const refreshToken = crypto.randomUUID();
    const hashedRefreshToken = await hash(refreshToken);

    let refreshTokenId = "";

    const [createdRefreshToken] = await db
      .insert(refreshTokens)
      .values({
        userId,
        hashedToken: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
      })
      .returning({ id: refreshTokens.id });

    refreshTokenId = createdRefreshToken?.id || "";

    const accessPayload = {
      name: userName,
      id: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // Token expires in 15 minutes
    };
    const accessToken = await sign(accessPayload, SECRET);

    const refreshPayload = {
      refreshToken,
      id: refreshTokenId,
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 25 * 30,
    };
    const signedRefreshToken = await sign(refreshPayload, SECRET);

    setCookie(c, ACCESS_TOKEN, accessToken, {
      path: "/",
      httpOnly: true,
      maxAge: 15 * 60, // Token expires in 15 minutes
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    setCookie(c, REFRESH_TOKEN, signedRefreshToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // Token expires in 30 days
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // TODO: Redirect to dashboard
    return c.redirect("/api/auth/health-check");
  } catch (err) {
    console.log(err);

    // TODO: Redirect to OAuth error page
    return c.redirect("/api/auth/health-check");
  }
};

export const signUpHandler: AppRouteHandler<SignUpRoute> = async (c) => {
  const { email, password, name } = c.req.valid("json");

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser?.[0])
      return c.json({ error: "Forbidden" }, http.UNAUTHORIZED);

    const hashPassword = await hash(password);

    const refreshToken = crypto.randomUUID();
    const hashedRefreshToken = await hash(refreshToken);

    const [user] = await db
      .insert(users)
      .values({ email, password: hashPassword, name })
      .returning({ id: users.id });

    const userId = user?.id || "";

    let refreshTokenId = "";

    const [createdRefreshToken] = await db
      .insert(refreshTokens)
      .values({
        userId,
        hashedToken: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
      })
      .returning({ id: refreshTokens.id });

    refreshTokenId = createdRefreshToken?.id || "";

    const refreshPayload = {
      refreshToken,
      id: refreshTokenId,
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 25 * 30,
    };
    const signedRefreshToken = await sign(refreshPayload, SECRET);

    const accessPayload = {
      name,
      id: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // Token expires in 15 minutes
    };
    const accessToken = await sign(accessPayload, SECRET);

    setCookie(c, ACCESS_TOKEN, accessToken, {
      path: "/",
      httpOnly: true,
      maxAge: 15 * 60, // Token expires in 15 minutes
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    setCookie(c, REFRESH_TOKEN, signedRefreshToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // Token expires in 30 days
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json({ success: true }, http.CREATED);
};

export const signInHandler: AppRouteHandler<SignInRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser || typeof existingUser.password !== "string")
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    const passwordsMatch = await verifyHash(existingUser.password, password);
    if (!passwordsMatch) {
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);
    } else {
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.userId, existingUser.id));
    }

    const refreshToken = crypto.randomUUID();
    const hashedRefreshToken = await hash(refreshToken);
    let refreshTokenId = "";

    const [createdRefreshToken] = await db
      .insert(refreshTokens)
      .values({
        userId: existingUser.id,
        hashedToken: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
      })
      .returning({ id: refreshTokens.id });

    refreshTokenId = createdRefreshToken?.id || "";

    const refreshPayload = {
      refreshToken,
      id: refreshTokenId,
      userId: existingUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 25 * 30,
    };
    const signedRefreshToken = await sign(refreshPayload, SECRET);

    const accessPayload = {
      name: existingUser.name,
      id: existingUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // Token expires in 15 minutes
    };
    const accessToken = await sign(accessPayload, SECRET);

    setCookie(c, ACCESS_TOKEN, accessToken, {
      path: "/",
      httpOnly: true,
      maxAge: 15 * 60, // Token expires in 15 minutes
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    setCookie(c, REFRESH_TOKEN, signedRefreshToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // Token expires in 30 days
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return c.json({ success: true }, http.OK);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Unexpected Error" }, http.INTERNAL_SERVER_ERROR);
  }
};

export const signOutHandler: AppRouteHandler<SignOutRoute> = async (c) => {
  // const accessToken = getCookie(c, ACCESS_TOKEN);
  const refreshToken = getCookie(c, REFRESH_TOKEN);

  if (!refreshToken)
    return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

  // TODO:
  // Add accessToken to blacklist
  deleteCookie(c, ACCESS_TOKEN);

  try {
    const payload = await verify(refreshToken, SECRET);

    if (
      typeof payload.userId !== "string" ||
      typeof payload.refreshToken !== "string" ||
      typeof payload.id !== "string"
    )
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    // await db.delete(refreshTokens)
    const [existing] = await db
      .select({ token: refreshTokens.hashedToken })
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.id, payload.id),
          eq(refreshTokens.userId, payload.userId),
        ),
      );

    if (typeof existing?.token !== "string")
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    const tokensMatch = await verifyHash(existing.token, payload.refreshToken);

    if (!tokensMatch)
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, payload.userId));

    deleteCookie(c, REFRESH_TOKEN);

    return c.json({ success: true }, http.OK);
  } catch (error) {
    console.log(error);
    return c.json({ error: "Unauthorized" }, http.INTERNAL_SERVER_ERROR);
  }
};

export const getUserHandler: AppRouteHandler<
  GetUserRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const { id, name } = c.get("user");

  const [user] = await db
    .select({
      githubId: users.githubId,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id));

  if (!user) return c.json({ error: "Not found" }, http.NOT_FOUND);

  return c.json({ id, name, ...user }, http.OK);
};
