import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

import auth from "@/features/auth/server";
import workspaces from "@/features/workspaces/server";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
