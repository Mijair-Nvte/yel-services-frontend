import { apiFetch } from "@/services/http";

export const OrgUserService = {
  // 📖 Para el Chat, Calendarios y Selects (Público para la empresa)
  getDirectory: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/directory`),

  // ⚙️ Obtiene la lista detallada para la tabla de Settings (Requiere permisos)
  getAll: (workspaceUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/users`),

  // 👁️ Detalles de un usuario y permisos
  getOne: (workspaceUid: string, userId: string | number) =>
    apiFetch(`/org-companies/${workspaceUid}/users/${userId}`),

  // ✏️ Actualiza el rol y los permisos
  update: (workspaceUid: string, userId: string | number, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // ❌ Elimina a un miembro
  remove: (workspaceUid: string, userId: string | number) =>
    apiFetch(`/org-companies/${workspaceUid}/users/${userId}`, {
      method: "DELETE",
    }),
};