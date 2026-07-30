import { api } from "@/lib/axios";
import type { CreateUserInput, UpdateUserInput, User } from "@/types/auth";

export interface UsersListResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<UsersListResponse>("/users");
  return data.users;
}

export async function fetchUserById(userId: string): Promise<User> {
  const { data } = await api.get<UserResponse>(`/users/${userId}`);
  return data.user;
}

export async function createUserRequest(input: CreateUserInput): Promise<User> {
  const { data } = await api.post<UserResponse>("/users", input);
  return data.user;
}

export async function updateUserRequest(
  userId: string,
  input: UpdateUserInput,
): Promise<User> {
  const { data } = await api.put<UserResponse>(`/users/${userId}`, input);
  return data.user;
}
