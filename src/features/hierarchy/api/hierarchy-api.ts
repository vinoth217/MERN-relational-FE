import { api } from "@/lib/axios";
import type { User } from "@/types/auth";
import type { Project } from "@/types/project";
import type { Role } from "@/types/role";
import type { Task } from "@/types/task";

export interface HierarchyOverview {
  currentRole: Role | null;
  subordinateRoles: Role[];
  users: User[];
  projects: Project[];
  tasks: Task[];
}

export async function fetchHierarchyOverview(): Promise<HierarchyOverview> {
  const { data } = await api.get<HierarchyOverview>("/hierarchy/overview");
  return data;
}
