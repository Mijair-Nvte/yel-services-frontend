import { apiFetch } from "@/services/http";

export const OrgCompanyService = {
  team: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/team`),
};
