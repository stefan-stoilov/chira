import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";
import { getCurrentUser } from "@/lib/get-current-user";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.has(nextUrl.pathname);
  const isPublicRoute = publicRoutes.has(nextUrl.pathname);

  if (isApiAuthRoute || isPublicRoute) return;

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

/**
 * This matcher configuration for NextJS middleware is recommended by clerk auth provider.
 * @see https://clerk.com/docs/references/nextjs/auth-middleware#usage
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
