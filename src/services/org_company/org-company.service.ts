import { apiFetch } from "@/services/http";

export const OrgCompanyService = {
  team: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/team`),

  getMember: (workspaceUid: string, memberId: string | number) =>
    apiFetch(`/org-companies/${workspaceUid}/team/${memberId}`),




  updateMember: (workspaceUid: string, memberId: string | number, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/team/${memberId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  updateMemberRole: (workspaceUid: string, userId: number, role: string) =>
    apiFetch(`/org-companies/${workspaceUid}/team/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),

  removeMember: (workspaceUid: string, userId: number) =>
    apiFetch(`/org-companies/${workspaceUid}/team/${userId}`, {
      method: "DELETE",
    }),



};
