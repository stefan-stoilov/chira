import { handle } from "hono/vercel";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { generateState } from "arctic";
import { GitHub } from "arctic";

const github = new GitHub(
  process.env.AUTH_GITHUB_ID!,
  process.env.AUTH_GITHUB_SECRET!,
  null,
);

const SECRET = "JWT_TOP_SECRET";

type GithubProfile = {
  name: string;
  id: number;
  email: string;
  avatar_url: string;
  login: string;
};

const app = new Hono();

app.get("/api/test/auth", async (c) => {
  const state = generateState();

  const scopes = ["user:email"];
  const url = github.createAuthorizationURL(state, scopes);
  setCookie(c, "github_oauth_state", state, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return c.redirect(url.toString());
});

app.get("/api/test/auth/callback", async (c) => {
  const storedState = getCookie(c, "github_oauth_state");
  const state = c.req.query("state");
  const code = c.req.query("code");

  // validate state
  if (
    typeof code !== "string" ||
    typeof storedState !== "string" ||
    state !== storedState
  ) {
    return c.json({ message: "Unauthorized" }, 400);
  }
  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.accessToken()}` },
    });

    const githubUser = (await githubUserResponse.json()) as GithubProfile;
    const { name, id, email } = githubUser;

    const payload = {
      name,
      id,
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    };
    const token = await sign(payload, SECRET);
    setCookie(c, "chira-cookie", token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    console.log("----------------------------------------------------");
    console.log({ githubUser });
    console.log("----------------------------------------------------");
    return c.redirect("/test");
  } catch (err) {
    console.log("----------------------------------------------------");
    console.log(err);
    console.log("----------------------------------------------------");
  }
});

app.get("/api/test/auth/verify", async (c) => {
  const session = getCookie(c, "chira-cookie");
  if (!session) return c.json({ error: "Unauthorized" }, 400);

  try {
    const decodedPayload = await verify(session, SECRET);
    return c.json({ decodedPayload }, 200);
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 400);
  }
});

app.get("/api/test/auth/forge", async (c) => {
  setCookie(c, "chira-cookie", "test", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return c.json({ message: "chira-cookie forged" }, 200);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
