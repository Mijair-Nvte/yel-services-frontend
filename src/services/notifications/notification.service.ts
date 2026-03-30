import { apiFetch } from "@/services/http";

export const NotificationService = {
    list: () => apiFetch("/notifications"),

    unread: () => apiFetch("/notifications/unread"),

    countUnread: () => apiFetch("/notifications/unread/count"),

    markAsRead: (id: number) =>
        apiFetch(`/notifications/${id}/read`, {
            method: "POST",
        }),

    markAll: () =>
        apiFetch(`/notifications/read-all`, {
            method: "POST",
        }),
};