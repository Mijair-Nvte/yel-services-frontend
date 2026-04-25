import { apiFetch } from "@/services/http";

export const ChatService = {
    // Listar mis chats en ESTA empresa
    list: (workspaceUid: string) =>
        apiFetch(`/org-companies/${workspaceUid}/chats`),

    // Buscar o crear chat con alguien de ESTA empresa
    getOrCreateDirect: (workspaceUid: string, targetUserId: number) =>
        apiFetch(`/org-companies/${workspaceUid}/chats/direct/${targetUserId}`),

    // Enviar mensaje
    sendMessage: (workspaceUid: string, conversationId: number, body: string) =>
        apiFetch(`/org-companies/${workspaceUid}/chats/${conversationId}/messages`, {
            method: "POST",
            body: JSON.stringify({ body }),
        }),

    // Marcar como leído
    markAsRead: (workspaceUid: string, conversationId: number) =>
        apiFetch(`/org-companies/${workspaceUid}/chats/${conversationId}/read`, { method: "POST" }),

    // Vaciar chat
    clearConversation: (workspaceUid: string, conversationId: number) =>
        apiFetch(`/org-companies/${workspaceUid}/chats/${conversationId}/clear`, { method: "DELETE" }),

    // Editar y Borrar (También contextuales)
    deleteMessage: (workspaceUid: string, messageId: number) =>
        apiFetch(`/org-companies/${workspaceUid}/messages/${messageId}`, { method: "DELETE" }),

    updateMessage: (workspaceUid: string, messageId: number, body: string) =>
        apiFetch(`/org-companies/${workspaceUid}/messages/${messageId}`, {
            method: "PUT",
            body: JSON.stringify({ body }),
        }),
};