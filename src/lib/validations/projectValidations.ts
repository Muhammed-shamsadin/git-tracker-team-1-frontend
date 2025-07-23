import { z } from "zod";

export const projectSettingsSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name must be at most 50 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "maintenance", "archived"], {
    required_error: "Please select a status",
  }),
});

export type ProjectSettingsFormData = z.infer<typeof projectSettingsSchema>;