import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";
import { Account, Databases, Storage, AppwriteException } from "node-appwrite";
import type {
  Account as AccountType,
  Databases as DatabasesType,
  Storage as StorageType,
  Models as ModelsType,
  // Users as UsersType,
} from "node-appwrite";

import { SESSION_COOKIE } from "@/server/routes/auth/constants";
import { createClient } from "@/server/lib/appwrite";

export type SessionMiddlewareVariables = {
  account: AccountType;
  databases: DatabasesType;
  storage: StorageType;
  // users: UsersType;
  user: ModelsType.User<ModelsType.Preferences>;
};

export const sessionMiddleware = createMiddleware<{
  Variables: SessionMiddlewareVariables;
}>(async (c, next) => {
  const client = createClient();

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

  return next();
});
