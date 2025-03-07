/**
 * A set of routes that are publicly accessible.
 * These routes do not require authentication.
 */
export const publicRoutes = new Set(["/", "/test"]);

/**
 * The prefix for the API authentication routes.
 * Any route starting with this prefix is used for API authentication purposes.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * A set of routes that are used for authentication
 * These routes will redirect logged in users to /protected
 */
export const authRoutes = new Set(["/sign-in", "/sign-up"]);

/**
 * The prefix for the API doc routes.
 * Any route starting with this prefix is used for API documentation purposes.
 */
export const apiDocPrefix = "/api/doc";

/**
 * The prefix for the API reference routes.
 * Any route starting with this prefix is used for API documentation purposes.
 */
export const apiReferencePrefix = "/api/reference";

/**
 * The default redirect path after successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const apiTestPrefix = "/api/test";
