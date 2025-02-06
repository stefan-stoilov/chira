import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
  apiDocPrefix,
  apiReferencePrefix,
  DEFAULT_LOGIN_REDIRECT,
  apiTestPrefix,
} from "@/routes";
import { getCurrentUser } from "@/lib/get-current-user";
import { env } from "@/env";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  console.log("MIDDLEWARE RAN");

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiTestRoute = nextUrl.pathname.startsWith(apiTestPrefix);

  const isAuthRoute = authRoutes.has(nextUrl.pathname);
  const isPublicRoute = publicRoutes.has(nextUrl.pathname);

  const isAccessibleDocRoute =
    env.NODE_ENV !== "production" &&
    (nextUrl.pathname.startsWith(apiDocPrefix) ||
      nextUrl.pathname.startsWith(apiReferencePrefix));

  if (isApiAuthRoute || isPublicRoute || isAccessibleDocRoute || isApiTestRoute)
    return;

  const user = await getCurrentUser();

  if (isAuthRoute) {
    if (user) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    } else {
      return;
    }
  }

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  } else {
    return;
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
