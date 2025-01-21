import { z } from "zod";

export const userSchema = z.object({
  $id: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  name: z.string(),
  email: z.string().email(),
  // password: z.string().optional(),
  // hash: z.string().optional(),
  // hashOptions: z.record(z.unknown()),
  // registration: z.string().uuid(),
  // status: z.boolean(),
  // labels: z.array(z.string()),
  // passwordUpdate: z.string().uuid(),
  // phone: z.string(),
  // emailVerification: z.boolean(),
  // phoneVerification: z.boolean(),
  // mfa: z.boolean(),
  // prefs: z.record(z.unknown()), // Assuming Preferences is a record type
  // targets: z.array(
  //   z.object({
  //     // Define Target schema here
  //     // For example:
  //     provider: z.string(),
  //     target: z.string(),
  //   }),
  // ),
  // accessedAt: z.string().uuid(),
});
