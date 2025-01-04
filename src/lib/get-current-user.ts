import { cookies } from "next/headers";
import { env } from "@/env";
import { SESSION_COOKIE } from "@/features/auth/constants";
import type { Models } from "node-appwrite";

export async function getCurrentUser() {
  const session = cookies().get(SESSION_COOKIE);
  if (!session) return null;

  const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/auth/current`, {
    method: "GET",
    headers: {
      Cookie: `${session.name}=${session.value}`,
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as unknown as {
    user: Models.User<Models.Preferences>;
  };
}
