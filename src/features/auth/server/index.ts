import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema, signUpSchema } from "../schemas";

const app = new Hono()
  .post("/sign-in", zValidator("json", signInSchema), (c) => {
    const { email, password } = c.req.valid("json");

    return c.json({ email, password });
  })
  .post("/sign-up", zValidator("json", signUpSchema), (c) => {
    const { name, email, password } = c.req.valid("json");

    return c.json({ name, email, password });
  });

export default app;
