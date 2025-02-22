import { verify, sign } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users, refreshTokens } from "@/server/db/schemas";
import { verifyHash } from "@/server/lib/crypto";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "@/server/routes/auth/auth.constants";
import * as http from "@/server/lib/http-status-codes";

const SECRET = process.env.SECRET!;

export type SessionMiddlewareVariables = {
  user: {
    id: string;
    name: string;
  };
};

export const sessionMiddleware = createMiddleware<{
  Variables: SessionMiddlewareVariables;
}>(async (c, next) => {
  const accessTokenCookie = getCookie(c, ACCESS_TOKEN);

  try {
    if (!accessTokenCookie) throw new Error();

    // TODO:
    // Check if access token is blacklisted

    const payload = await verify(accessTokenCookie, SECRET);

    if (typeof payload.id !== "string" || typeof payload.name !== "string")
      throw new Error();

    c.set("user", {
      id: payload.id,
      name: payload.name,
    });
  } catch (e) {
    const refreshTokenCookie = getCookie(c, REFRESH_TOKEN);
    if (!refreshTokenCookie)
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    try {
      const decodedPayload = await verify(refreshTokenCookie, SECRET);

      if (
        typeof decodedPayload.refreshToken !== "string" ||
        typeof decodedPayload.id !== "string"
      )
        return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

      const [data] = await db
        .select({
          refreshTokens: {
            userId: refreshTokens.userId,
            hashedToken: refreshTokens.hashedToken,
            expiresAt: refreshTokens.expiresAt,
          },
          users: {
            id: users.id,
            name: users.name,
          },
        })
        .from(refreshTokens)
        .where(eq(refreshTokens.id, decodedPayload.id))
        .leftJoin(users, eq(users.id, refreshTokens.userId));

      if (!data?.users) {
        return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);
      } else if (new Date(data.refreshTokens.expiresAt) < new Date()) {
        await db
          .delete(refreshTokens)
          .where(eq(refreshTokens.userId, data.users.id));

        return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);
      }

      const tokensMatch = await verifyHash(
        data.refreshTokens.hashedToken,
        decodedPayload.refreshToken,
      );

      if (!tokensMatch)
        return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

      const accessPayload = {
        name: data.users.name,
        id: data.users.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 15, // Token expires in 15 minutes
      };
      const accessToken = await sign(accessPayload, SECRET);

      setCookie(c, ACCESS_TOKEN, accessToken, {
        path: "/",
        httpOnly: true,
        maxAge: 15 * 60, // Token expires in 15 minutes
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      c.set("user", {
        id: data.users.id,
        name: data.users.name,
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);
    }
  }

  return next();
});
