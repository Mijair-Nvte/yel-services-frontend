// src/services/org_notices/org-notice.service.ts
import { apiFetch } from "@/services/http";

export const OrgNoticeService = {
  list: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/notices`),

  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/notices`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (uid: string, payload: any) =>
    apiFetch(`/org-company-notices/${uid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (uid: string) =>
    apiFetch(`/org-company-notices/${uid}`, {
      method: "DELETE",
    }),
};
