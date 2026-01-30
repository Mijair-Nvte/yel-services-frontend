// src/services/org_notices/org-notice.service.ts
import { apiFetch } from "@/services/http";

export const OrgNoticeService = {
  listGlobalCompanie: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/notices`),

  listByArea: (workspaceUid: string, areaUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas/${areaUid}/notices`),

  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/notices`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createForArea: (workspaceUid: string, areaUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/notices`, {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        org_area_uid: areaUid,
      }),
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

  pin: (uid: string) =>
    apiFetch(`/org-company-notices/${uid}`, {
      method: "PUT",
      body: JSON.stringify({ is_pinned: true }),
    }),

  unpin: (uid: string) =>
    apiFetch(`/org-company-notices/${uid}`, {
      method: "PUT",
      body: JSON.stringify({ is_pinned: false }),
    }),

  levels: () => apiFetch(`/notice-levels`),
};
