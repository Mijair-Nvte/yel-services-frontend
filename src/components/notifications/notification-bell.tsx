"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80">
        <div className="p-2 text-sm font-medium">Notificaciones</div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className="p-2 border-b text-sm">
              {n.data?.title || "Sin título"}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
