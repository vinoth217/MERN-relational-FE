import { z } from "zod";
import { ROLE_PERMISSIONS } from "@/types/role";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name is required")
    .max(50, "Role name is too long"),
  description: z.string().max(250, "Description is too long").optional(),
  permissions: z
    .array(z.enum(ROLE_PERMISSIONS))
    .min(1, "Select at least one permission"),
  reportsToId: z.string().optional(),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
