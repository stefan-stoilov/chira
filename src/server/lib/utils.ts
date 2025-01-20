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

export function createErrorMessageSchema() {
  return z.object({ error: z.string() });
}
