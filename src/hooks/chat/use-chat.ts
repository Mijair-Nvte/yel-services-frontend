"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ChatService } from "@/services/chat/chat.service";
import { getEcho } from "@/lib/echo";
import { useAuthStore } from "@/store/auth.store";

export function useChat(workspaceUid: string) {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // useRef para mantener una referencia actualizada del activeConversation en los listeners de Echo
    const activeConvRef = useRef<any>(null);
    activeConvRef.current = activeConversation;

    // ===============================
    // ✅ CARGAR LISTA DE CHATS
    // ===============================
    const loadConversations = useCallback(async () => {
        if (!workspaceUid || !user?.id) return;
        try {
            const res = await ChatService.list(workspaceUid);
            setConversations(res || []);
        } catch (error) {
            console.error("Error cargando chats", error);
        } finally {
            setLoading(false);
        }
    }, [workspaceUid, user?.id]);

    // ===============================
    // ✅ ABRIR UN CHAT DIRECTO
    // ===============================
    const openDirectChat = async (targetUser: any) => {
        setLoadingMessages(true);
        try {
            const res = await ChatService.getOrCreateDirect(workspaceUid, targetUser.id);
            setActiveConversation(res.conversation);
            // Paginación de Laravel viene ordenada desc, la volteamos para el chat
            setMessages(res.messages.data.reverse());

            await ChatService.markAsRead(workspaceUid,res.conversation.id);
            loadConversations();
        } catch (error) {
            console.error("Error abriendo chat", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // ===============================
    // ✅ ENVIAR MENSAJE
    // ===============================
    const sendMessage = async (text: string) => {
        if (!activeConversation || !user) return;

        try {
            // Optimistic UI
            const tempId = Date.now();
            const timestamp = new Date().toISOString(); // 🔥 Creamos la fecha una sola vez

            const tempMsg = {
                id: tempId,
                chat_conversation_id: activeConversation.id,
                sender_id: user.id,
                body: text,
                created_at: timestamp, // 🔥 Misma fecha
                updated_at: timestamp, // 🔥 Añadimos esta línea para que sean idénticas
                sender: { id: user.id, name: user.name }
            };
            setMessages((prev) => [...prev, tempMsg]);

            // Enviamos a la API
            const realMsg = await ChatService.sendMessage(workspaceUid,activeConversation.id, text);

            // Reemplazamos el temporal con el real de la BD
            setMessages((prev) => prev.map(m => m.id === tempId ? realMsg : m));
            loadConversations();
        } catch (error) {
            console.error("Error enviando mensaje", error);
        }
    };
    // ===============================
    // ✅ VACIAR HISTORIAL DEL CHAT
    // ===============================
    const clearChat = async () => {
        if (!activeConversation) return;
        try {
            await ChatService.clearConversation(workspaceUid,activeConversation.id);
            setMessages([]); // Limpiamos la UI
            loadConversations();
        } catch (error) {
            console.error("Error vaciando chat", error);
        }
    };

    // ===============================
    // ✅ ELIMINAR MENSAJE ESPECÍFICO
    // ===============================
    const deleteMessage = async (messageId: number) => {
        try {
            // Optimistic delete
            setMessages((prev) => prev.filter(m => m.id !== messageId));
            await ChatService.deleteMessage(workspaceUid,messageId);
            loadConversations();
        } catch (error) {
            console.error("Error eliminando mensaje", error);
        }
    };


    // ===============================
    // ✅ EDITAR MENSAJE
    // ===============================
    const editMessage = async (messageId: number, newText: string) => {
        try {
            // Optimistic Update: Actualizamos la UI al instante
            setMessages((prev) =>
                prev.map(m => m.id === messageId ? { ...m, body: newText, updated_at: new Date().toISOString() } : m)
            );

            const updatedMsg = await ChatService.updateMessage(workspaceUid, messageId, newText);

            // Confirmamos con el dato de la BD
            setMessages((prev) =>
                prev.map(m => m.id === messageId ? updatedMsg : m)
            );
        } catch (error: any) {
            console.error("Error editando mensaje", error);
            // Si la API devuelve error 403 (ya leído), podrías recargar los mensajes para revertir el Optimistic Update
            loadConversations();
        }
    };

    // ===============================
    // ✅ EFECTO INICIAL: Cargar chats
    // ===============================
    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // ===============================
    // ✅ EFECTO: Suscripción a Pusher
    // ===============================
    useEffect(() => {
        const echo = getEcho();
        if (!echo || !activeConversation) return;

        const channelName = `chat.${activeConversation.id}`;
        const channel = echo.private(channelName);

        channel.listen(".message.sent", (e: any) => {
            // Si el mensaje lo envié yo en otra pestaña, o si es del otro usuario
            if (e.message.sender_id !== user?.id) {
                setMessages((prev) => [...prev, e.message]);
                ChatService.markAsRead(workspaceUid, activeConversation.id);
                loadConversations(); // Para subirlo en la lista de la sidebar
            }
        });

        channel.listen(".message.edited", (e: any) => {
            setMessages((prev) =>
                prev.map(m => m.id === e.message.id ? e.message : m)
            );
            loadConversations(); // Actualiza la preview en el sidebar
        });

        return () => {
            echo.leave(channelName);
        };
    }, [activeConversation?.id, user?.id, loadConversations]);

    return {
        conversations,
        activeConversation,
        messages,
        loading,
        loadingMessages,
        openDirectChat,
        sendMessage,
        clearChat,
        deleteMessage,
        editMessage
    };
}