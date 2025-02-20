export const runtime = "edge";

import { handle } from "hono/vercel";

import { authRouter } from "@/server/routes/new-auth";
import { workspacesRouter } from "@/server/routes/new-workspaces";
import { configureOpenAPI } from "@/server/lib/configure-open-api";
import { createApp } from "@/server/lib/create-app";

const app = createApp();

configureOpenAPI(app);

const routes = [authRouter, workspacesRouter] as const;

routes.forEach((route) => {
  app.route("/", route);
});

configureOpenAPI(app);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// import { Hono } from "hono";
// import { getCookie, setCookie, deleteCookie } from "hono/cookie";
// import { createMiddleware } from "hono/factory";
// import { sign, verify } from "hono/jwt";
// import { generateState, GitHub } from "arctic";

// const github = new GitHub(
//   process.env.AUTH_GITHUB_ID!,
//   process.env.AUTH_GITHUB_SECRET!,
//   null,
// );

// const SECRET = "JWT_TOP_SECRET";

// const sessionMiddleware = createMiddleware(async (c, next) => {
//   const session = getCookie(c, "chira-session-token");
//   if (!session) return c.json({ error: "Unauthorized" }, 400);

//   try {
//     await verify(session, SECRET);
//   } catch (error) {
//     return c.json({ error: "Unauthorized" }, 400);
//   }

//   return next();
// });

// type GithubProfile = {
//   name: string;
//   id: number;
//   email: string;
//   avatar_url: string;
//   login: string;
// };

// const app = new Hono();

// app.get("/api/test/auth", async (c) => {
//   const state = generateState();

//   const scopes = ["user:email"];
//   const url = github.createAuthorizationURL(state, scopes);
//   setCookie(c, "github_oauth_state", state, {
//     path: "/",
//     httpOnly: true,
//     maxAge: 60 * 10,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//   });

//   return c.redirect(url.toString());
// });

// app.get("/api/test/auth/callback", async (c) => {
//   const storedState = getCookie(c, "github_oauth_state");
//   const state = c.req.query("state");
//   const code = c.req.query("code");

//   // validate state
//   if (
//     typeof code !== "string" ||
//     typeof storedState !== "string" ||
//     state !== storedState
//   ) {
//     return c.json({ message: "Unauthorized" }, 400);
//   }
//   try {
//     const tokens = await github.validateAuthorizationCode(code);

//     const githubUserResponse = await fetch("https://api.github.com/user", {
//       headers: { Authorization: `Bearer ${tokens.accessToken()}` },
//     });

//     const githubUser = (await githubUserResponse.json()) as GithubProfile;
//     const { name, id, email } = githubUser;

//     const payload = {
//       name,
//       id,
//       email,
//       exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 7 days
//     };
//     const token = await sign(payload, SECRET);
//     setCookie(c, "chira-session-token", token, {
//       path: "/",
//       httpOnly: true,
//       maxAge: 60 * 10,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     });

//     console.log("----------------------------------------------------");
//     console.log({ githubUser });
//     console.log("----------------------------------------------------");
//     // {
//     //   githubUser: {
//     //     login: 'stefan-stoilov',
//     //     id: 96513042,
//     //     node_id: 'U_kgDOBcCsEg',
//     //     avatar_url: 'https://avatars.githubusercontent.com/u/96513042?v=4',
//     //     gravatar_id: '',
//     //     url: 'https://api.github.com/users/stefan-stoilov',
//     //     html_url: 'https://github.com/stefan-stoilov',
//     //     followers_url: 'https://api.github.com/users/stefan-stoilov/followers',
//     //     following_url: 'https://api.github.com/users/stefan-stoilov/following{/other_user}',
//     //     gists_url: 'https://api.github.com/users/stefan-stoilov/gists{/gist_id}',
//     //     starred_url: 'https://api.github.com/users/stefan-stoilov/starred{/owner}{/repo}',
//     //     subscriptions_url: 'https://api.github.com/users/stefan-stoilov/subscriptions',
//     //     organizations_url: 'https://api.github.com/users/stefan-stoilov/orgs',
//     //     repos_url: 'https://api.github.com/users/stefan-stoilov/repos',
//     //     events_url: 'https://api.github.com/users/stefan-stoilov/events{/privacy}',
//     //     received_events_url: 'https://api.github.com/users/stefan-stoilov/received_events',
//     //     type: 'User',
//     //     user_view_type: 'public',
//     //     site_admin: false,
//     //     name: 'Stefan Stoilov',
//     //     company: null,
//     //     blog: 'stefan-stoilov.info',
//     //     location: 'Bulgaria',
//     //     email: null,
//     //     hireable: null,
//     //     bio: null,
//     //     twitter_username: null,
//     //     notification_email: null,
//     //     public_repos: 6,
//     //     public_gists: 0,
//     //     followers: 1,
//     //     following: 1,
//     //     created_at: '2021-12-22T05:19:01Z',
//     //     updated_at: '2025-01-03T09:29:11Z'
//     //   }
//     // }
//     return c.redirect("/test");
//   } catch (err) {
//     console.log("----------------------------------------------------");
//     console.log(err);
//     console.log("----------------------------------------------------");
//   }
// });

// app.get("/api/test/auth/verify", sessionMiddleware, async (c) => {
//   return c.json({ message: "Verified" }, 200);
// });

// app.get("/api/test/auth/sign-out", async (c) => {
//   const session = getCookie(c, "chira-session-token");
//   if (!session) return c.json({ error: "Unauthorized" }, 400);

//   deleteCookie(c, "chira-session-token", {
//     path: "/",
//     secure: true,
//     sameSite: "Lax",
//   });
//   deleteCookie(c, "github_oauth_state", {
//     path: "/",
//     secure: true,
//     sameSite: "Lax",
//   });

//   return c.json({ message: "Successfully signed out" });
// });

// app.get("/api/test/auth/forge", async (c) => {
//   setCookie(c, "chira-session-token", "test", {
//     path: "/",
//     httpOnly: true,
//     maxAge: 60 * 10,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//   });

//   return c.json({ message: "chira-session-token forged" }, 200);
// });
