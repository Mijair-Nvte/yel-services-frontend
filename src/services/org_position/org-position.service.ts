import { apiFetch } from "@/services/http";

export const OrgPositionService = {
  list: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/positions`),

  create: (workspaceUid: string, payload: { name: string }) =>
    apiFetch(`/org-companies/${workspaceUid}/positions`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  delete: (workspaceUid: string, id: number) =>
    apiFetch(`/org-companies/${workspaceUid}/positions/${id}`, {
      method: "DELETE",
    }),
};
