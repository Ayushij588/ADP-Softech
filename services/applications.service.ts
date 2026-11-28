import { apiRequest } from "@/services/api-client";
import type {
  ApiApplication,
  ApiApplicationNote,
  ApiApplicationStatusHistory,
  BackendApplicationStatus,
} from "@/types/api";

type ApplicationsListResponse = {
  success: boolean;
  message: string;
  total: number;
  applications: ApiApplication[];
};

type ApplicationResponse = {
  success: boolean;
  message: string;
  application: ApiApplication;
};

type NotesListResponse = {
  success: boolean;
  message: string;
  total: number;
  notes: ApiApplicationNote[];
};

type NoteResponse = {
  success: boolean;
  message: string;
  applicationNote: ApiApplicationNote;
};

type HistoryListResponse = {
  success: boolean;
  message: string;
  total: number;
  history: ApiApplicationStatusHistory[];
};

export async function getApplications(params?: {
  status?: BackendApplicationStatus;
  jobId?: string;
  search?: string;
}): Promise<ApiApplication[]> {
  const response = await apiRequest<ApplicationsListResponse>("/applications", {
    query: params,
  });
  return response.applications;
}

export async function getApplicationById(id: string): Promise<ApiApplication> {
  const response = await apiRequest<ApplicationResponse>(`/applications/${id}`);
  return response.application;
}

export async function updateApplicationStatus(
  id: string,
  status: BackendApplicationStatus,
  remarks?: string,
): Promise<ApiApplication> {
  const response = await apiRequest<ApplicationResponse>(
    `/applications/${id}/status`,
    {
      method: "PATCH",
      body: { status, remarks },
    },
  );
  return response.application;
}

export async function getApplicationNotes(
  applicationId: string,
): Promise<ApiApplicationNote[]> {
  const response = await apiRequest<NotesListResponse>(
    `/application-notes/${applicationId}`,
  );
  return response.notes;
}

export async function addApplicationNote(
  applicationId: string,
  note: string,
): Promise<ApiApplicationNote> {
  const response = await apiRequest<NoteResponse>("/application-notes", {
    method: "POST",
    body: { applicationId, note },
  });
  return response.applicationNote;
}

export async function getApplicationStatusHistory(
  applicationId: string,
): Promise<ApiApplicationStatusHistory[]> {
  const response = await apiRequest<HistoryListResponse>(
    `/application-status-history/${applicationId}`,
  );
  return response.history;
}
