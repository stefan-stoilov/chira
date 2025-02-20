import { deleteCookie, setCookie } from "hono/cookie";
import { AppwriteException, ID } from "node-appwrite";

import { createAdminClient } from "@/server/lib/appwrite";
import { SESSION_COOKIE } from "@/server/routes/auth/constants";
import type {
  AppRouteHandler,
  AppMiddlewareVariables,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { SignInRoute, SignUpRoute, SignOutRoute } from "../auth.routes";

export const signIn: AppRouteHandler<SignInRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, SESSION_COOKIE, session.secret, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (error) {
    if (error instanceof AppwriteException) {
      return c.json({ error: error.message }, 401);
    } else {
      return c.json({ error: "Unexpected error." }, 500);
    }
  }

  return c.json({ success: true }, 200);
};

export const signUp: AppRouteHandler<SignUpRoute> = async (c) => {
  const { email, password, name } = c.req.valid("json");

  try {
    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, SESSION_COOKIE, session.secret, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (error) {
    if (error instanceof AppwriteException) {
      return c.json({ error: error.message }, 401);
    } else {
      return c.json({ error: "Unexpected error." }, 500);
    }
  }

  return c.json({ success: true }, 200);
};

export const signOut: AppRouteHandler<
  SignOutRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const account = c.get("account");

  try {
    await account.deleteSession("current");
    deleteCookie(c, SESSION_COOKIE);
    return c.json({ success: true }, 200);
  } catch (error) {
    return c.json({ error: "Unexpected error." }, 500);
  }
};
