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

  useEffect(() => {
    if (!user?.id) return;

    console.log("🟢 USER READY:", user.id);

    load();

    const echo = getEcho();
    if (!echo) return;

    const channelName = `user.${user.id}`;

    console.log("📡 Suscribiendo a:", channelName);

    const channel = echo.private(channelName);

    channel.listen(".notification.created", (e: any) => {
      console.log("🔥 EVENTO LLEGÓ", e);

      const newNotification = {
        id: e.id,
        type: e.type,
        data: e.data,
        created_at: e.created_at,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast(e.data?.title || "Nueva notificación");
    });

    return () => {
      console.log("🔴 Leaving:", channelName);
      echo.leave(channelName);
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    reload: load,
  };
}