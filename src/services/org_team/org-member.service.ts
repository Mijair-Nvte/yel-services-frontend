import { apiFetch } from "@/services/http";

export const OrgMemberService = {
  // Obtiene la lista de todos los miembros
  getAll: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/members`),

  // Obtiene los datos, rol y permisos de un miembro específico
  getOne: (workspaceUid: string, memberId: string | number) =>
    apiFetch(`/org-companies/${workspaceUid}/members/${memberId}`),

  // Actualiza el rol y los permisos específicos de un miembro
  update: (workspaceUid: string, memberId: string | number, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/members/${memberId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // Elimina a un miembro de la compañía
  remove: (workspaceUid: string, memberId: string | number) =>
    apiFetch(`/org-companies/${workspaceUid}/members/${memberId}`, {
      method: "DELETE",
    }),
};