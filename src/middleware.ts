import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verify } from "hono/jwt";
import { eq } from "drizzle-orm";

import {
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
  apiDocPrefix,
  apiReferencePrefix,
  DEFAULT_LOGIN_REDIRECT,
  apiTestPrefix,
} from "@/routes";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "@/server/routes/auth/auth.constants";
import { db } from "@/server/db";
import { users, refreshTokens } from "@/server/db/schemas";
import { verifyHash } from "@/server/lib/crypto";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiTestRoute = nextUrl.pathname.startsWith(apiTestPrefix);

  const isAuthRoute = authRoutes.has(nextUrl.pathname);
  const isPublicRoute = publicRoutes.has(nextUrl.pathname);

  const isAccessibleDocRoute =
    process.env.NODE_ENV !== "production" &&
    (nextUrl.pathname.startsWith(apiDocPrefix) ||
      nextUrl.pathname.startsWith(apiReferencePrefix));

  if (isApiAuthRoute || isPublicRoute || isAccessibleDocRoute || isApiTestRoute)
    return;

  const cookieStore = cookies();

  const accessTokenCookie = cookieStore.get(ACCESS_TOKEN)?.value;

  try {
    if (!accessTokenCookie) throw new Error();

    // TODO:
    // Check if access token is blacklisted

    await verify(accessTokenCookie, process.env.SECRET!);
    if (isAuthRoute)
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));

    return;
  } catch (e) {
    const refreshTokenCookie = cookieStore.get(REFRESH_TOKEN)?.value;

    if (!refreshTokenCookie) {
      if (isAuthRoute) return;
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }

    try {
      const decodedPayload = await verify(
        refreshTokenCookie,
        process.env.SECRET!,
      );

      if (
        typeof decodedPayload.refreshToken !== "string" ||
        typeof decodedPayload.id !== "string"
      ) {
        if (isAuthRoute) return;
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
      }

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
        if (isAuthRoute) return;
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
      } else if (new Date(data.refreshTokens.expiresAt) < new Date()) {
        await db
          .delete(refreshTokens)
          .where(eq(refreshTokens.userId, data.users.id));

        if (isAuthRoute) return;
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
      }

      const tokensMatch = await verifyHash(
        data.refreshTokens.hashedToken,
        decodedPayload.refreshToken,
      );

      if (!tokensMatch) {
        if (isAuthRoute) return;
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
      }
    } catch (error) {
      console.log(error);
      if (isAuthRoute) return;
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - logo.svg, small-logo.svg
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo.svg|small-logo.svg).*)",
  ],
};
