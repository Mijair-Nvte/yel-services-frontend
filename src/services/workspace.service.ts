import { apiFetch } from "@/services/http";

export const WorkspaceService = {
  list: () => apiFetch("/org-companies"),

  create: (payload: any) =>
    apiFetch("/org-companies", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

get: (uid: string) =>
  apiFetch(`/org-companies/${uid}`),

  update: (id: number, payload: any) =>
    apiFetch(`/org-companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
