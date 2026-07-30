import { api } from "@/lib/axios";
import type { AuthSession, LoginCredentials } from "@/types/auth";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const { data } = await api.post<AuthSession>("/auth/login", credentials);
  return data;
}

export async function logoutRequest(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Client-side logout still proceeds if the API call fails
  }
}
