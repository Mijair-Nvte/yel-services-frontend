import { apiFetch } from "@/services/http";

export const OrgPartnerAdminService = {
  // LIST (Permite filtrar por status: 'pending', 'approved', 'rejected')
  list: (workspaceUid: string, status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch(`/org-companies/${workspaceUid}/partners${query}`);
  },

  // SHOW (Detalle de un partner)
  show: (workspaceUid: string, partnerId: number | string) =>
    apiFetch(`/org-companies/${workspaceUid}/partners/${partnerId}`),

  // APPROVE
  approve: (workspaceUid: string, partnerId: number | string) =>
    apiFetch(`/org-companies/${workspaceUid}/partners/${partnerId}/approve`, {
      method: "POST",
    }),

  // REJECT
  reject: (workspaceUid: string, partnerId: number | string) =>
    apiFetch(`/org-companies/${workspaceUid}/partners/${partnerId}/reject`, {
      method: "POST",
    }),
};