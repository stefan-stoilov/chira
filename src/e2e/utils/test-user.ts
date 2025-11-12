// tests/e2e/helpers/seed.ts
import { db } from "@/server/db";
import { users, refreshTokens } from "@/server/db/schemas";
import { hash } from "@/server/lib/crypto";
import { sign } from "hono/jwt";
import { eq } from "drizzle-orm";
import { env } from "@/env";

export const TEST_USER = {
  password: "ExamplePassword123",
  name: "E2E Test User",
};

export async function createTestUser() {
  const hashedPassword = await hash(TEST_USER.password);

  const [user] = await db
    .insert(users)
    .values({
      email: `${crypto.randomUUID()}@example.com`,
      name: TEST_USER.name,
      password: hashedPassword,
    })
    .returning({ id: users.id, name: users.name });

  if (!user) throw new Error("Failed to create test user");

  const refreshToken = crypto.randomUUID();
  const hashedRefreshToken = await hash(refreshToken);

  const [refreshTokenRecord] = await db
    .insert(refreshTokens)
    .values({
      userId: user.id,
      hashedToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning({ id: refreshTokens.id });

  if (!refreshTokenRecord) throw new Error("Failed to create refresh token");

  const accessPayload = {
    name: user.name,
    id: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 15,
  };
  const accessToken = await sign(accessPayload, env.SECRET);

  const refreshPayload = {
    refreshToken,
    id: refreshTokenRecord.id,
    userId: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
  const signedRefreshToken = await sign(refreshPayload, env.SECRET);

  return {
    user,
    tokens: {
      accessToken,
      refreshToken: signedRefreshToken,
    },
  };
}

export async function cleanupTestUser({ id }: { id: string }) {
  await db.delete(users).where(eq(users.id, id));
}
