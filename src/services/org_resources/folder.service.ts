// src/services/org_resources/folder.service.ts
import { apiFetch } from "@/services/http";

export const FolderService = {
  // 📂 Carpetas raíz
  roots: (params: {
    companyUid: string;
    folderableType: "company" | "area";
    folderableUid: string;
  }) => {
    // Si es área, mandamos el area_uid en la query string
    const query = params.folderableType === "area" ? `&area_uid=${params.folderableUid}` : "";
    return apiFetch(
      `/org-companies/${params.companyUid}/folders?type=${params.folderableType}${query}`
    );
  },

  // 📁 Subcarpetas + documentos
  children: (companyUid: string, folderId: number) =>
    apiFetch(`/org-companies/${companyUid}/folders/${folderId}/children`),

  // ➕ Crear carpeta (raíz o subcarpeta)
  create: (payload: {
    companyUid: string;
    name: string;
    parent_id?: number | null;
    folderableType: "company" | "area";
    folderableUid: string;
  }) =>
    apiFetch(`/org-companies/${payload.companyUid}/folders`, {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        parent_id: payload.parent_id ?? null,
        // Ya no necesitas mandar company_uid en el body porque va en la URL, 
        // pero mandamos el area_uid si es necesario
        area_uid: payload.folderableType === "area" ? payload.folderableUid : null,
      }),
    }),

  rename: (companyUid: string, folderId: number, name: string) =>
    apiFetch(`/org-companies/${companyUid}/folders/${folderId}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  remove: (companyUid: string, folderId: number) =>
    apiFetch(`/org-companies/${companyUid}/folders/${folderId}`, {
      method: "DELETE",
    }),
};
