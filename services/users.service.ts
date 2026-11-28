import { apiRequest } from "@/services/api-client";
import type { ApiUser, BackendUserStatus } from "@/types/api";

type RecruitersListResponse = {
  success: boolean;
  message: string;
  data: ApiUser[];
};

type RecruiterResponse = {
  success: boolean;
  message: string;
  data: ApiUser;
};

export async function getRecruiters(): Promise<ApiUser[]> {
  const response = await apiRequest<RecruitersListResponse>("/users/recruiters");
  return response.data;
}

export async function createRecruiter(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  const response = await apiRequest<RecruiterResponse>("/auth/create-recruiter", {
    method: "POST",
    body: payload,
  });
  return response.data;
}

export async function updateRecruiter(
  id: string,
  payload: { name?: string; email?: string },
): Promise<ApiUser> {
  const response = await apiRequest<RecruiterResponse>(`/users/recruiters/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return response.data;
}

export async function updateRecruiterStatus(
  id: string,
  status: BackendUserStatus,
): Promise<ApiUser> {
  const response = await apiRequest<RecruiterResponse>(
    `/users/recruiters/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
  return response.data;
}

export async function resetRecruiterPassword(
  id: string,
  password: string,
): Promise<ApiUser> {
  const response = await apiRequest<RecruiterResponse>(
    `/users/recruiters/${id}/reset-password`,
    {
      method: "PATCH",
      body: { password },
    },
  );
  return response.data;
}
