import { apiFetch } from "@/services/http";

export const OrgCalendarService = {
  list: (
    workspaceUid: string,
    params: { from: string; to: string }
  ) => {
    return apiFetch(
      `/org-companies/${workspaceUid}/events?from=${params.from}&to=${params.to}`
    );
  },

  create: (workspaceUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/events`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (workspaceUid: string, eventUid: string, payload: any) =>
    apiFetch(`/org-companies/${workspaceUid}/events/${eventUid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (workspaceUid: string, eventUid: string) =>
    apiFetch(`/org-companies/${workspaceUid}/events/${eventUid}`, {
      method: "DELETE",
    }),
};
