import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string({ message: "Project name is required." })
    .trim()
    .min(1)
    .max(255),
});
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z
    .string({ message: "Project name is must be at least 1 character." })
    .trim()
    .min(1),
});
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
