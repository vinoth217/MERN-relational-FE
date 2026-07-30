import { api } from "@/lib/axios";
import type { CreateRoleInput, Role, RoleWeightageInput } from "@/types/role";

export interface RolesListResponse {
  roles: Role[];
}

export interface RoleResponse {
  role: Role;
}

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await api.get<RolesListResponse>("/roles");
  return data.roles;
}

export async function fetchRoleById(roleId: string): Promise<Role> {
  const { data } = await api.get<RoleResponse>(`/roles/${roleId}`);
  return data.role;
}

export async function createRoleRequest(
  input: CreateRoleInput,
): Promise<Role> {
  const { data } = await api.post<RoleResponse>("/roles", input);
  return data.role;
}

export async function updateRoleRequest(
  roleId: string,
  input: CreateRoleInput,
): Promise<Role> {
  const { data } = await api.put<RoleResponse>(`/roles/${roleId}`, input);
  return data.role;
}

export async function updateRoleWeightagesRequest(
  weightages: RoleWeightageInput[],
): Promise<Role[]> {
  const { data } = await api.put<RolesListResponse>("/roles/weightages", {
    weightages,
  });
  return data.roles;
}
