"use client";

import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notifications/notification.service";
import { getEcho } from "@/lib/echo";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

export function useNotifications() {
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await NotificationService.list();
      setNotifications(data);

      const count = await NotificationService.countUnread();
      setUnreadCount(count.count);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NUEVO: Marcar una sola como leída
  const markAsRead = async (id: number) => {
    // 1. Actualización optimista (UI instantánea)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // 2. Petición en segundo plano
    try {
      await NotificationService.markAsRead(id);
    } catch (error) {
      console.error("Error al marcar como leída:", error);
      load(); // Si falla, recargamos para tener la verdad de la base de datos
    }
  };

  // 🔥 NUEVO: Marcar todas como leídas
  const markAllAsRead = async () => {
    // 1. Actualización optimista (UI instantánea)
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
    setUnreadCount(0);

    // 2. Petición en segundo plano
    try {
      await NotificationService.markAll();
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      load();
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    load();

    const echo = getEcho();
    if (!echo) return;

    const channelName = `user.${user.id}`;
    const channel = echo.private(channelName);

    channel.listen(".notification.created", (e: any) => {
      const newNotification = {
        id: e.id,
        type: e.type,
        data: e.data,
        created_at: e.created_at,
        read_at: null, // Asegurarnos de que entra como no leída
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast(e.data?.title || "Nueva notificación");
    });

    return () => {
      echo.leave(channelName);
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    reload: load,
    markAsRead,     // Exportamos la función
    markAllAsRead,  // Exportamos la función
  };
}