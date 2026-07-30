import { z } from "zod";
import { TASK_PRIORITIES } from "@/types/task";

export const createTaskSchema = z.object({
  name: z.string().min(2, "Task name is required"),
  description: z.string().max(1000, "Description is too long").optional(),
  projectId: z.string().min(1, "Project is required"),
  dueDate: z.string().min(1, "Timeline to complete is required"),
  priority: z.enum(TASK_PRIORITIES),
  assignedTo: z.string().min(1, "Assign to is required"),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
