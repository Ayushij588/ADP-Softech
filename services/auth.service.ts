import {
  apiRequest,
  clearStoredSession,
  setStoredSession,
} from "@/services/api-client";
import type { ApiUser, AuthSession } from "@/types/api";

type LoginResponse = {
  success: boolean;
  message: string;
  data: AuthSession;
};

type MeResponse = {
  success: boolean;
  message: string;
  user: {
    userId: string;
    role: ApiUser["role"];
  };
};

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<AuthSession> {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    token: null,
  });

  setStoredSession(response.data);
  return response.data;
}

export async function fetchCurrentUser(): Promise<MeResponse["user"]> {
  const response = await apiRequest<MeResponse>("/auth/me");
  return response.user;
}

export function logoutSession(): void {
  clearStoredSession();
}
