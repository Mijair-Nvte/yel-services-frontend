// src/services/org_resources/folder.service.ts
import { apiFetch } from "@/services/http";

export const FolderService = {
  // 📂 Carpetas raíz
  roots: (params: {
    folderableType: "company" | "area";
    folderableUid: string;
  }) =>
    apiFetch(
      `/folders?type=${params.folderableType}&uid=${params.folderableUid}`,
    ),

  // 📁 Subcarpetas + documentos
  children: (folderId: number) => apiFetch(`/folders/${folderId}/children`),

  // ➕ Crear carpeta (raíz o subcarpeta)
  create: (payload: {
    name: string;
    parent_id?: number | null;
    folderableType: "company" | "area";
    folderableUid: string;
  }) =>
    apiFetch("/folders", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        parent_id: payload.parent_id ?? null,
        company_uid:
          payload.folderableType === "company" ? payload.folderableUid : null,
        area_uid:
          payload.folderableType === "area" ? payload.folderableUid : null,
      }),
    }),

  rename: (folderId: number, name: string) =>
    apiFetch(`/folders/${folderId}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  remove: (folderId: number) =>
    apiFetch(`/folders/${folderId}`, {
      method: "DELETE",
    }),
};
