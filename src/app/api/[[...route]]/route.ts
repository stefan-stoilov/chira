export const runtime = "edge";
export const fetchCache = "default-no-store";

import { handle } from "hono/vercel";
import { app } from "@/server/app";

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
