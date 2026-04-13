import { apiFetch } from "@/services/http";

export const ChatService = {
    list: (workspaceUid: string) =>
        apiFetch(`/org-companies/${workspaceUid}/chats`),

    getOrCreateDirect: (workspaceUid: string, targetUserId: number) =>
        apiFetch(`/org-companies/${workspaceUid}/chats/direct/${targetUserId}`),

    sendMessage: (conversationId: number, body: string) =>
        apiFetch(`/chats/${conversationId}/messages`, {
            method: "POST",
            body: JSON.stringify({ body }),
        }),

    markAsRead: (conversationId: number) =>
        apiFetch(`/chats/${conversationId}/read`, { method: "POST" }),

    clearConversation: (conversationId: number) =>
        apiFetch(`/chats/${conversationId}/clear`, { method: "DELETE" }),

    deleteMessage: (messageId: number) =>
        apiFetch(`/messages/${messageId}`, { method: "DELETE" }),

    updateMessage: (messageId: number, body: string) =>
        apiFetch(`/messages/${messageId}`, {
            method: "PUT",
            body: JSON.stringify({ body }),
        }),
};