import { apiFetch } from "@/services/http";

export const DepartmentService = {
  // LIST
  list: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas`),

  // CREATE
  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/areas`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // UPDATE (Normalizado)
  update: (workspaceUid: string, areaUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/areas/${areaUid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // DELETE (Normalizado)
  delete: (workspaceUid: string, areaUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas/${areaUid}`, {
      method: "DELETE",
    }),

  // GET SINGLE (Normalizado)
  get: (workspaceUid: string, areaUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas/${areaUid}`),

  // TEAM BY AREA (Normalizado)
  team: (workspaceUid: string, areaUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas/${areaUid}/team`),
};