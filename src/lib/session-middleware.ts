import "server-only";
import { env } from "@/env";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { Client, Account, AppwriteException } from "node-appwrite";
import type {
  Account as AccountType,
  // Databases as DatabasesType,
  // Storage as StorageType,
  Models as ModelsType,
  // Users as UsersType,
} from "node-appwrite";

import { SESSION_COOKIE } from "@/features/auth/constants";

export const sessionMiddleware = createMiddleware<{
  Variables: {
    account: AccountType;
    // databases: DatabasesType;
    // storage: StorageType;
    // users: UsersType;
    user: ModelsType.User<ModelsType.Preferences>;
  };
}>(async (c, next) => {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const sessionCookie = getCookie(c, SESSION_COOKIE);

  if (!sessionCookie) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  client.setSession(sessionCookie);

  try {
    const account = new Account(client);
    const user = await account.get();

    c.set("account", account);
    c.set("user", user);
  } catch (error) {
    if (error instanceof AppwriteException) {
      return c.json({ error: error.message }, 500);
    } else {
      return c.json({ error: "Unexpected error occurred" }, 500);
    }
  }

  await next();
});
