import { apiFetch } from "@/services/http";

export const DepartmentService = {
  list: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas`),

  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/areas`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (areaId: number, payload: any) =>
    apiFetch(`/org-areas/${areaId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  get: (departmentUid: string) => apiFetch(`/org-areas/${departmentUid}`),

  team: (departmentUid: string) => apiFetch(`/org-areas/${departmentUid}/team`),
};
