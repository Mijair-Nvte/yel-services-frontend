import { apiFetch } from "@/services/http";

export const DepartmentService = {
  list: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas`),

  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/areas`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (departmentUid: string, payload: any) =>
    apiFetch(`/org-areas/${departmentUid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (departmentUid: string) =>
    apiFetch(`/org-areas/${departmentUid}`, {
      method: "DELETE",
    }),

  get: (departmentUid: string) => apiFetch(`/org-areas/${departmentUid}`),

  team: (departmentUid: string) => apiFetch(`/org-areas/${departmentUid}/team`),
};
