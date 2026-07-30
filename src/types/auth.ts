export type UserRole = "ADMIN" | "ORG_MANAGER" | "PROJECT_MANAGER" | "MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
