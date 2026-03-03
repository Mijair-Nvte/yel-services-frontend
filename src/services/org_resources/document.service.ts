// src/services/org_resources/document.service.ts
import { apiFetch } from "@/services/http";

export const DocumentService = {
  presign: (params: { file: File; folderUid: string }) =>
    apiFetch("/documents/presign", {
      method: "POST",
      body: JSON.stringify({
        folder_uid: params.folderUid,
        file_name: params.file.name,
        mime_type: params.file.type,
        file_size: params.file.size,
      }),
    }),

  confirm: (payload: {
    folder_uid: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    key: string;
  }) =>
    apiFetch("/documents/confirm", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  delete: (uid: string) =>
    apiFetch(`/documents/${uid}`, { method: "DELETE" }),
};