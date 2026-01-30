import { apiFetch } from "@/services/http";

export const OrgCompanyService = {
  team: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/team`),

  invite: (
    workspaceUid: string,
    payload: {
      email: string;
      role: string;
      org_area_id?: number | null;
    },
  ) =>
    apiFetch(`/org-companies/${workspaceUid}/invitations`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
