import { z } from "zod";

// The regular expression below checks that a password:
// Has minimum 8 characters in length. Adjust it by modifying {8,}
// At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
// At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
// At least one digit. You can remove this condition by removing (?=.*?[0-9])
// At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%^&*-])
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const signUpSchema = z.object({
  name: z
    .string({
      message:
        "Name is required and should be at least 2 characters in length.",
    })
    .trim()
    .min(2),
  email: z.string().email(),
  password: z.string().regex(passwordRegex, {
    message:
      "Password must have a minimum of 8 characters, at least one uppercase and lowercase character, at least one digit and special character.",
  }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
