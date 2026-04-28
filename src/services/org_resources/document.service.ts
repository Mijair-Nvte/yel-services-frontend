import { apiFetch } from "@/services/http";

export const DocumentService = {
  presign: (params: { companyUid: string; file: File; folderUid: string }) =>
    apiFetch(`/org-companies/${params.companyUid}/documents/presign`, {
      method: "POST",
      body: JSON.stringify({
        folder_uid: params.folderUid,
        file_name: params.file.name,
        mime_type: params.file.type,
        file_size: params.file.size,
      }),
    }),

  confirm: (payload: {
    companyUid: string;
    folder_uid: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    key: string;
  }) =>
    apiFetch(`/org-companies/${payload.companyUid}/documents/confirm`, {
      method: "POST",
      body: JSON.stringify({
        folder_uid: payload.folder_uid,
        original_name: payload.original_name,
        mime_type: payload.mime_type,
        file_size: payload.file_size,
        key: payload.key,
      }),
    }),

  delete: (companyUid: string, uid: string) =>
    apiFetch(`/org-companies/${companyUid}/documents/${uid}`, { method: "DELETE" }),
};