export type UserRole = "ADMIN" | "ORG_MANAGER" | "PROJECT_MANAGER" | "MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  projectId?: string;
  projectName?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  projectId: string;
}

export interface UpdateUserInput {
  name: string;
  projectId: string;
}
