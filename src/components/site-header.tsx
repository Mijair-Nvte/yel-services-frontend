"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { NavUser } from "@/components/nav-user";
import { MessageCircleMore, Gift } from "lucide-react";
import Link from "next/link";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useChatNotificationsStore } from "@/store/chat-notifications.store";
import { useAuthStore } from "@/store/auth.store";
import { ChatSheet } from "@/components/chat/chat-sheet";
import { cn } from "@/lib/utils";
import { TimeTrackingWidget } from "@/components/time_tracking/time-tracking-widget";
export function SiteHeader() {
  const { workspace } = useWorkspaceStore();
  const { hasUnreadMessages } = useChatNotificationsStore();
  const user = useAuthStore((state) => state.user);

  
  return (
      <header className="bg-white sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">

      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex-1">
          <h1 className="text-sm font-medium text-muted-foreground hidden sm:block">
            Dashboard /{" "}
            <span className="text-foreground">{workspace?.name}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 ">

          <TimeTrackingWidget />
          
          {/* Icono de CHAT */}
         <ChatSheet />

          {/* Notificaciones */}
          <NotificationBell />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          {/* Perfil del Usuario */}
          {user && (
            <NavUser
              user={{
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
