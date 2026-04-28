import { useQuery } from "@tanstack/react-query";
import { getAdminStatsApi } from "./api";

export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStatsApi,
    staleTime: 60 * 1000,
  });
