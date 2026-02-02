import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { insertAssignmentSchema } from "@shared/schema";
import { z } from "zod";

export function useAssignments() {
  return useQuery({
    queryKey: [api.assignments.list.path],
    queryFn: async () => {
      const res = await fetch(api.assignments.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch assignments");
      return api.assignments.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    // allow partial updates (only status is required for toggles)
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<z.infer<typeof insertAssignmentSchema>>) => {
      const url = buildUrl(api.assignments.update.path, { id });
      const validated = api.assignments.update.input.parse(updates);
      
      const res = await fetch(url, {
        method: api.assignments.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Assignment not found");
        throw new Error("Failed to update assignment");
      }
      
      return api.assignments.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.assignments.list.path] });
    },
  });
}
