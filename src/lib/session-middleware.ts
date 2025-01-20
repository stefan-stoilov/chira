import "server-only";
import { env } from "@/env";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";
import {
  Client,
  Account,
  Databases,
  Storage,
  AppwriteException,
} from "node-appwrite";
import type {
  Account as AccountType,
  Databases as DatabasesType,
  Storage as StorageType,
  Models as ModelsType,
  // Users as UsersType,
} from "node-appwrite";

import { SESSION_COOKIE } from "@/features/auth/constants";

export const sessionMiddleware = createMiddleware<{
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
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
    const databases = new Databases(client);
    const storage = new Storage(client);

    c.set("account", account);
    c.set("user", user);
    c.set("databases", databases);
    c.set("storage", storage);
  } catch (error) {
    if (error instanceof AppwriteException) {
      return c.json(
        { error: error.message },
        error.code as ClientErrorStatusCode | ServerErrorStatusCode,
      );
    } else {
      return c.json({ error: "Unexpected error." }, 500);
    }
  }

  await next();
});
