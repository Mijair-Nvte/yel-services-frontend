import { apiFetch } from "@/services/http";

export const OrgAssignmentService = {
  assign: (payload: {
    user_id: number;
    org_area_id: number;
    org_role_id: number;
    position_title?: string;
  }) =>
    apiFetch(`/org-area-user-roles`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  remove: (assignmentId: number) =>
    apiFetch(`/org-area-user-roles/${assignmentId}`, {
      method: "DELETE",
    }),
};
