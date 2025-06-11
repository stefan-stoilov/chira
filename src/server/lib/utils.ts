import { z } from "zod";
import type { ZodSchema } from "./types.js";

export function jsonContent<T extends ZodSchema>(
  schema: T,
  description: string,
) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}

export function jsonContentRequired<T extends ZodSchema>(
  schema: T,
  description: string,
) {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
}

export function formContent<T extends ZodSchema>(
  schema: T,
  description: string,
) {
  return {
    content: {
      "multipart/form-data": {
        schema,
      },
    },
    description,
    required: true,
  };
}

export function createSuccessSchema() {
  return z.object({ success: z.boolean() });
}

export function createMessageSchema(message = "") {
  return z
    .object({
      message: z.string(),
    })
    .openapi({
      example: {
        message,
      },
    });
}

export function createErrorMessageSchema() {
  return z.object({ error: z.string() });
}

export function createValidationErrorSchema<T extends ZodSchema>(schema: T) {
  const { error } = schema.safeParse(
    schema._def.typeName === z.ZodFirstPartyTypeKind.ZodArray ? [] : {},
  );
  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example: error,
      }),
  });
}

export function generateInviteCode(): string {
  const length = 6;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}
