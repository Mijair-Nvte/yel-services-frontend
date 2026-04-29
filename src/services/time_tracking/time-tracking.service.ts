import { apiFetch } from "@/services/http";

export const TimeTrackingService = {

    list: (workspaceUid: string, params?: any) => {
        const query = new URLSearchParams(params).toString();
        return apiFetch(`/org-companies/${workspaceUid}/time-tracking?${query}`);
    },

    // OBTENER ESTADO ACTUAL (¿Está corriendo el tiempo?)
    getStatus: (workspaceUid: string) =>
        apiFetch(`/org-companies/${workspaceUid}/time-tracking/status`),

    // CHECK IN
    checkIn: (workspaceUid: string) =>
        apiFetch(`/org-companies/${workspaceUid}/time-tracking/check-in`, {
            method: "POST",
        }),

    // CHECK OUT
    checkOut: (workspaceUid: string, payload?: { notes?: string }) =>
        apiFetch(`/org-companies/${workspaceUid}/time-tracking/check-out`, {
            method: "POST",
            body: JSON.stringify(payload || {}),
        }),
};