import { apiFetch } from "@/services/http";

export const OrgLinkService = {
  // LIST LINKS
  list: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/links`),

  // CREATE
  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/links`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // UPDATE
  update: (uid: string, payload: any) =>
    apiFetch(`/org-company-links/${uid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // DELETE
  delete: (uid: string) =>
    apiFetch(`/org-company-links/${uid}`, {
      method: "DELETE",
    }),
};
