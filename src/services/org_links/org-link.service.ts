import { apiFetch } from "@/services/http";

export const OrgLinkService = {
  // LIST
  list: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/links`),

  // CREATE
  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/links`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // UPDATE (Normalizado con workspaceUid)
  update: (workspaceUid: string, linkUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/links/${linkUid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // DELETE (Normalizado con workspaceUid)
  delete: (workspaceUid: string, linkUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/links/${linkUid}`, {
      method: "DELETE",
    }),
};