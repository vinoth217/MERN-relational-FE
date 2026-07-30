import { api } from "@/lib/axios";
import type { CreateTaskInput, Task } from "@/types/task";

export interface TasksListResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<TasksListResponse>("/tasks");
  return data.tasks;
}

export async function createTaskRequest(
  input: CreateTaskInput,
): Promise<Task> {
  const { data } = await api.post<TaskResponse>("/tasks", input);
  return data.task;
}
