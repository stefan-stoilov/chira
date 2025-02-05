import { createRoute } from "@hono/zod-openapi";

import { sessionMiddleware } from "@/server/middlewares";
import {
  createSuccessSchema,
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import { userSchema } from "@/server/schemas";
import { signInSchema, signUpSchema } from "@/features/auth/schemas";

const tags = ["Auth"];

export const getCurrent = createRoute({
  method: "get",
  path: "/api/auth/current",
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(userSchema, "User"),
    401: jsonContent(
      createErrorMessageSchema().openapi({
        example: { error: "Unauthorized" },
      }),
      "Unauthorized",
    ),
    500: jsonContent(
      createErrorMessageSchema().openapi({
        example: { error: "Unexpected error" },
      }),
      "Server error",
    ),
  },
});

export type GetCurrentRoute = typeof getCurrent;

export const signIn = createRoute({
  method: "post",
  path: "/api/auth/sign-in",
  tags,
  request: {
    body: jsonContentRequired(signInSchema, "Credentials"),
  },
  responses: {
    200: jsonContent(createSuccessSchema(), "Sign in"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    422: jsonContent(
      createValidationErrorSchema(signInSchema),
      "The validation error(s)",
    ),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});

export type SignInRoute = typeof signIn;

export const signUp = createRoute({
  method: "post",
  path: "/api/auth/sign-up",
  tags,
  request: {
    body: jsonContentRequired(signUpSchema, "Credentials"),
  },
  responses: {
    200: jsonContent(createSuccessSchema(), "Sign up"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    422: jsonContent(
      createValidationErrorSchema(signUpSchema),
      "The validation error(s)",
    ),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});

export type SignUpRoute = typeof signUp;

export const signOut = createRoute({
  method: "post",
  path: "/api/auth/sign-out",
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(createSuccessSchema(), "Sign Out"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});

export type SignOutRoute = typeof signOut;
