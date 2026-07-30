import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "ORG_MANAGER", "PROJECT_MANAGER", "MEMBER"]),
  projectId: z.string().min(1, "Project is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  projectId: z.string().min(1, "Project is required"),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
