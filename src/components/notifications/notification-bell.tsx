"use client";

import {
  Bell,
  Calendar,
  FileText,
  Megaphone,
  CheckCheck,
  Info,
} from "lucide-react";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const timeAgo = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "Justo ahora";
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} horas`;

  return date.toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getNotificationUI = (type: string) => {
  switch (type) {
    case "event.created":
      return {
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        label: "Nuevo Evento",
      };
    case "document.created":
      return {
        icon: FileText,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        label: "Nuevo Documento",
      };
    case "notice.created":
      return {
        icon: Megaphone,
        color: "text-orange-600",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        label: "Nuevo Aviso",
      };
    default:
      return {
        icon: Info,
        color: "text-gray-600",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        label: "Notificación",
      };
  }
};

export function NotificationBell() {
  // 🔥 Extraemos markAsRead y markAllAsRead del hook
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-950">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0 shadow-lg rounded-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-semibold text-sm">Notificaciones</div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-primary hover:text-primary/80"
              onClick={() => markAllAsRead()} // 🔥 Conectado
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Marcar leídas
            </Button>
          )}
        </div>

        {/* LISTA DE NOTIFICACIONES */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
              <Bell className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm">No tienes notificaciones nuevas</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => {
                const isUnread = n.read_at === null;
                const ui = getNotificationUI(n.type);
                const Icon = ui.icon;

                return (
                  <div
                    key={n.id}
                    // 🔥 Conectado: Si no está leída, al hacer clic la marca como leída
                    onClick={() => {
                      if (isUnread) markAsRead(n.id);
                    }}
                    className={`flex items-start gap-3 border-b px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer ${
                      isUnread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ui.bgColor}`}>
                      <Icon className={`h-4 w-4 ${ui.color}`} />
                    </div>

                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {ui.label}
                        </p>
                        <span className="shrink-0 text-[10px] text-gray-400">
                          {timeAgo(n.created_at)}
                        </span>
                      </div>

                      <p className={`text-sm truncate ${isUnread ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-300"}`}>
                        {n.data?.title || "Sin título"}
                      </p>

                      {n.type === "event.created" && n.data?.starts_at && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          📅{" "}
                          {new Date(n.data.starts_at).toLocaleDateString("es-MX", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    {isUnread && (
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 shadow-sm" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {notifications.length > 0 && (
          <div className="border-t p-2 text-center">
            <Button variant="ghost" size="sm" className="w-full text-xs text-gray-500">
              Ver todas las notificaciones
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}