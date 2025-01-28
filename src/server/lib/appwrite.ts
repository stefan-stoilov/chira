import "server-only";
import { env } from "@/env";
import { Client, Account, Storage, Users, Databases } from "node-appwrite";

/**
 * See {@link https://appwrite.io/docs/tutorials/nextjs-ssr-auth/step-3|Next.js SSR Auth }
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT)
    .setKey(env.NEXT_APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export function createClient() {
  return new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT);
}
