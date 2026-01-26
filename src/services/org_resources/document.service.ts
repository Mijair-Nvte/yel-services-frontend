// src/services/org_resources/document.service.ts
import { apiFetch } from "@/services/http";

export const DocumentService = {
  upload: async (params: { file: File; folderUid: string }) => {
    const form = new FormData();
    form.append("file", params.file);
    form.append("folder_uid", params.folderUid);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),

      },
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return data;
  },

  delete: (uid: string) => apiFetch(`/documents/${uid}`, { method: "DELETE" }),
};
