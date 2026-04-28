import { apiClient } from "../../lib/api";
import type { AdminStats } from "./types";

export const getAdminStatsApi = async (): Promise<AdminStats> => {
  const { data } = await apiClient.get<AdminStats>("/admin/stats");
  return data;
};
