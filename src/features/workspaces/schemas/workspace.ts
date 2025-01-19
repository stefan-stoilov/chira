import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string({ message: "Workspace name is required." }).trim().min(1),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Workspace name must be 1 or more characters." })
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;
