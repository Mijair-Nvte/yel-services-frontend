import { apiFetch } from "@/services/http";

export const OrgTeamInviteService = {
    invite: (
        workspaceUid: string,
        payload: {
            email: string;
            role: string;
            org_area_id?: number | null;
            permissions: string[]; 
        }
    ) =>
        apiFetch(`/org-companies/${workspaceUid}/invitations`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),
};