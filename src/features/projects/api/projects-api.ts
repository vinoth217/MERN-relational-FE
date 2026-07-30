import { api } from "@/lib/axios";
import type { Project } from "@/types/project";

export interface ProjectsListResponse {
  projects: Project[];
}

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await api.get<ProjectsListResponse>("/projects");
  return data.projects;
}
