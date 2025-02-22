import { createRoute, z } from "@hono/zod-openapi";

import { signInSchema, signUpSchema } from "@/features/auth/schemas";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  createSuccessSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Auth"];

export const oauthRoute = createRoute({
  method: "get",
  path: "/api/oauth",
  tags,
  responses: {
    [http.MOVED_PERMANENTLY]: {
      description: "Redirect",
    },
  },
});
export type OAuthRoute = typeof oauthRoute;

export const oauthCallbackRoute = createRoute({
  method: "get",
  path: "/api/oauth/callback",
  tags,
  responses: {
    [http.MOVED_PERMANENTLY]: {
      description: "Redirect",
    },
  },
});
export type OAuthCallbackRoute = typeof oauthCallbackRoute;

export const signInRoute = createRoute({
  method: "post",
  path: "/api/auth/sign-in",
  tags,
  request: {
    body: jsonContentRequired(signInSchema, "Credentials"),
  },
  responses: {
    [http.OK]: jsonContent(createSuccessSchema(), "Sign in"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(signInSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Server error",
    ),
  },
});
export type SignInRoute = typeof signInRoute;

export const signUpRoute = createRoute({
  method: "post",
  path: "/api/auth/sign-up",
  tags,
  request: {
    body: jsonContentRequired(signUpSchema, "Credentials"),
  },
  responses: {
    [http.CREATED]: jsonContent(createSuccessSchema(), "Sign up"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(signUpSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Server error",
    ),
  },
});
export type SignUpRoute = typeof signUpRoute;

export const getUserRoute = createRoute({
  method: "get",
  path: "/api/auth/user",
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    [http.OK]: jsonContent(
      z.object({
        id: z.string(),
        name: z.string(),
        githubId: z.union([z.number(), z.null()]),
        email: z.union([z.string(), z.null()]),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      "User",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
  },
});
export type GetUserRoute = typeof getUserRoute;

export const signOutRoute = createRoute({
  method: "post",
  path: "/api/auth/sign-out",
  tags,
  responses: {
    [http.OK]: jsonContent(createSuccessSchema(), "Sign Out"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Server error",
    ),
  },
});
export type SignOutRoute = typeof signOutRoute;
