import { apiFetch } from "@/services/http";

export const OrgAssignmentService = {
  // Asignar usuario a un área
  assign: (workspaceUid: string, payload: {
    user_id: number;
    org_area_id: number;
    org_role_id: number;
    position_title?: string;
  }) =>
    apiFetch(`/org-companies/${workspaceUid}/area-assignments`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Remover usuario del área
  remove: (workspaceUid: string, assignmentId: number) =>
    apiFetch(`/org-companies/${workspaceUid}/area-assignments/${assignmentId}`, {
      method: "DELETE",
    }),

  // Obtener equipo de un área específica
  getTeamByArea: (workspaceUid: string, areaUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/areas/${areaUid}/team`),
};