import { apiRequest } from "@/services/api-client";
import type { ApiDashboardData, DashboardFilters } from "@/types/api";

type DashboardResponse = {
  success: boolean;
  message: string;
  dashboard: ApiDashboardData;
};

export async function getDashboard(
  filters: DashboardFilters = {},
): Promise<ApiDashboardData> {
  const response = await apiRequest<DashboardResponse>("/dashboard", {
    query: filters,
  });
  return response.dashboard;
}
