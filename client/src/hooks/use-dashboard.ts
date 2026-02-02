import { useQuery } from "@tanstack/react-query";
import { api, type DashboardResponse } from "@shared/routes";

export function useDashboard() {
  return useQuery({
    queryKey: [api.dashboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch dashboard data");
      }
      return api.dashboard.get.responses[200].parse(await res.json());
    },
  });
}
