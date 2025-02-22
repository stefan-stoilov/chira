import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string({ message: "Workspace name is required." }).trim().min(1),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const createWorkspaceServerSchema = z.object({
  name: z.string({ message: "Workspace name is required." }).trim().min(1),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  fileName: z.string().optional(),
});

export type CreateWorkspaceServerSchema = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z
    .string({ message: "Workspace name is must be at least 1 character." })
    .trim()
    .min(1),
});

export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;

export const updateWorkspaceServerSchema = z.object({
  name: z
    .string({ message: "Workspace name is must be at least 1 character." })
    .trim()
    .min(1)
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  fileName: z.string().optional(),
});

export type UpdateWorkspaceServerSchema = z.infer<
  typeof updateWorkspaceServerSchema
>;
