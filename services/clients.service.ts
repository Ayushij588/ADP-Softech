import { apiRequest } from "@/services/api-client";
import type { ApiClient } from "@/types/api";

type ClientsListResponse = {
  success: boolean;
  total: number;
  clients: ApiClient[];
};

type ClientResponse = {
  success: boolean;
  message?: string;
  client: ApiClient;
};

export async function getClients(): Promise<ApiClient[]> {
  const response = await apiRequest<ClientsListResponse>("/clients");
  return response.clients;
}

export async function createClient(payload: {
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  industry?: string;
  website?: string;
  contactPhone?: string;
  address?: string;
}): Promise<ApiClient> {
  const response = await apiRequest<ClientResponse>("/clients", {
    method: "POST",
    body: payload,
  });
  return response.client;
}

export async function updateClientStatus(
  id: string,
  status: "active" | "inactive",
): Promise<ApiClient> {
  const response = await apiRequest<ClientResponse>(`/clients/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return response.client;
}
