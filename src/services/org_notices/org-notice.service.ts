import { apiFetch } from "@/services/http";

export const OrgNoticeService = {
  listGlobalCompanie: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/notices`),

  listByArea: (workspaceUid: string, areaUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas/${areaUid}/notices`),

  create: (workspaceUid: string, payload: {
    title: string;
    body: string;
    notice_level_id: number;
    org_area_uid?: string; // Opcional: si viene, Laravel lo asigna al área
    published_at?: string;
    is_pinned?: boolean;
  }) =>
    apiFetch(`/org-companies/${workspaceUid}/notices`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 🔥 UPDATE NORMALIZADO
  update: (workspaceUid: string, noticeUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/notices/${noticeUid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // 🔥 DELETE NORMALIZADO
  delete: (workspaceUid: string, noticeUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/notices/${noticeUid}`, {
      method: "DELETE",
    }),

  pin: (workspaceUid: string, noticeUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/notices/${noticeUid}/pin`, {
      method: "POST",
    }),

  unpin: (workspaceUid: string, noticeUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/notices/${noticeUid}/unpin`, {
      method: "POST",
    }),

  levels: () => apiFetch(`/notice-levels`),
};