export const ROLE_PERMISSIONS = [
  "CREATE_TASK",
  "ASSIGN_TASK",
  "VIEW_TASK",
  "UPDATE_TASK",
  "DELETE_TASK",
  "CREATE_PROJECT",
  "MANAGE_USERS",
] as const;

export type RolePermission = (typeof ROLE_PERMISSIONS)[number];

export const ROLE_PERMISSION_OPTIONS: Array<{
  value: RolePermission;
  label: string;
}> = [
  { value: "CREATE_TASK", label: "Create task" },
  { value: "ASSIGN_TASK", label: "Assign task" },
  { value: "VIEW_TASK", label: "View task" },
  { value: "UPDATE_TASK", label: "Update task" },
  { value: "DELETE_TASK", label: "Delete task" },
  { value: "CREATE_PROJECT", label: "Create project" },
  { value: "MANAGE_USERS", label: "Manage users" },
];

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: RolePermission[];
  reportsToId?: string;
  reportsToName?: string;
  weightage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions: RolePermission[];
  reportsToId?: string;
  weightage?: number;
}

export interface RoleWeightageInput {
  id: string;
  weightage: number;
}
