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
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { workspace } = useWorkspaceStore();
  const { hasUnreadMessages } = useChatNotificationsStore();
  const user = useAuthStore((state) => state.user);

  return (
<header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
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
          {/* Icono de CHAT */}
          <Link
            href={workspace ? `/dashboard/${workspace.uid}/chat` : "#"}
            className={cn(
              "group relative flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95",
            )}
          >
            {/* Contenedor del Icono Estilo Squircle */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
              <MessageCircleMore className="h-5 w-5" />
            </div>

            {/* Indicador de Notificación (Dot) */}
            {hasUnreadMessages && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                {/* Efecto de pulso */}
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                {/* Punto sólido con borde para que resalte sobre el fondo */}
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-amber-500 shadow-sm"></span>
              </span>
            )}
          </Link>

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
