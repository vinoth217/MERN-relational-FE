export const PROJECT_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  organizationId: string;
  organizationName: string;
  taskTotal: number;
  taskInProgress: number;
  taskCompleted: number;
  createdAt: string;
  updatedAt: string;
}
