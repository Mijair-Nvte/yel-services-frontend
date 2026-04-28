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
import { cn } from "@/lib/utils";

const timeAgo = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "Justo ahora";
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  if (diffInMinutes < 1440)
    return `Hace ${Math.floor(diffInMinutes / 60)} horas`;

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
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* BOTÓN TRIGGER ESTILO SAAS */}
        <button className="group relative flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 outline-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100 group-hover:text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            <Bell className="h-5 w-5" />
          </div>

          {/* INDICADOR DE CONTEO */}
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-orange-500 px-1 text-[10px] font-bold text-white shadow-sm dark:border-gray-950">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 shadow-2xl rounded-2xl overflow-hidden border-muted/60"
      >
        {/* HEADER DEL DROPDOWN */}
        <div className="flex items-center justify-between bg-gray-50/50 dark:bg-muted/20 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notificaciones</span>
            {unreadCount > 0 && (
              <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Marcar leídas
            </Button>
          )}
        </div>

        {/* LISTA DE NOTIFICACIONES */}
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <Bell className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900">Todo al día</p>
              <p className="text-xs text-gray-500 mt-1">
                No tienes notificaciones pendientes
              </p>
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
                    onClick={() => isUnread && markAsRead(n.id)}
                    className={cn(
                      "group flex items-start gap-4 border-b px-4 py-4 transition-all cursor-pointer last:border-0",
                      isUnread
                        ? "bg-blue-50/30 hover:bg-blue-50/60 dark:bg-blue-900/10"
                        : "hover:bg-gray-50 dark:hover:bg-muted/40",
                    )}
                  >
                    {/* ICONO DE LA NOTIFICACIÓN */}
                    <div
                      className={cn(
                        "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
                        ui.bgColor,
                      )}
                    >
                      <Icon className={cn("h-5 w-5", ui.color)} />
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground/80">
                          {ui.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {timeAgo(n.created_at)}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-sm leading-snug break-words",
                          isUnread
                            ? "font-semibold text-gray-900 dark:text-gray-100"
                            : "text-gray-600 dark:text-gray-400",
                        )}
                      >
                        {n.data?.title || "Sin título"}
                      </p>

                      {/* EXTRA DATA (FECHAS DE EVENTO) */}
                      {n.type === "event.created" && n.data?.starts_at && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-blue-600 font-medium bg-blue-50 w-fit px-2 py-0.5 rounded-md">
                          <Calendar className="h-3 w-3" />
                          {new Date(n.data.starts_at).toLocaleDateString(
                            "es-MX",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      )}
                    </div>

                    {/* DOT DE NO LEÍDO */}
                    {isUnread && (
                      <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {notifications.length > 0 && (
          <div className="border-t bg-gray-50/50 dark:bg-muted/20 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Ver todo el historial
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
