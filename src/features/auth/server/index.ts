import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { signInSchema, signUpSchema } from "../schemas";
import { SESSION_COOKIE } from "../constants";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ user });
  })

  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, SESSION_COOKIE, session.secret, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })

  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, SESSION_COOKIE, session.secret, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })

  .post("/sign-out", sessionMiddleware, async (c) => {
    const account = c.get("account");
    await account.deleteSession("current");
    deleteCookie(c, SESSION_COOKIE);

    return c.json({ success: true });
  });

export default app;
