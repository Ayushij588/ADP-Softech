import { apiRequest } from "@/services/api-client";
import type {
  ApiJob,
  BackendJobStatus,
  CreateJobPayload,
} from "@/types/api";

type JobsListResponse = {
  success: boolean;
  message: string;
  total: number;
  jobs: ApiJob[];
};

type JobResponse = {
  success: boolean;
  message: string;
  job: ApiJob;
};

export async function getJobs(): Promise<ApiJob[]> {
  const response = await apiRequest<JobsListResponse>("/jobs");
  return response.jobs;
}

export async function getJobById(id: string): Promise<ApiJob> {
  const response = await apiRequest<JobResponse>(`/jobs/${id}`);
  return response.job;
}

export async function createJob(payload: CreateJobPayload): Promise<ApiJob> {
  const response = await apiRequest<JobResponse>("/jobs", {
    method: "POST",
    body: payload,
  });
  return response.job;
}

export async function updateJob(
  id: string,
  payload: Partial<CreateJobPayload>,
): Promise<ApiJob> {
  const response = await apiRequest<JobResponse>(`/jobs/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return response.job;
}

export async function updateJobStatus(
  id: string,
  status: BackendJobStatus,
): Promise<ApiJob> {
  const response = await apiRequest<JobResponse>(`/jobs/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return response.job;
}

export async function updateJobPublication(
  id: string,
  isPublished: boolean,
): Promise<ApiJob> {
  const response = await apiRequest<JobResponse>(`/jobs/${id}/publication`, {
    method: "PATCH",
    body: { isPublished },
  });
  return response.job;
}

export async function deleteJob(id: string): Promise<ApiJob> {
  const response = await apiRequest<JobResponse>(`/jobs/${id}`, {
    method: "DELETE",
  });
  return response.job;
}
