import { apiFetch } from "@/services/http";

export const DashboardService = {
  overview: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/dashboard`),
};