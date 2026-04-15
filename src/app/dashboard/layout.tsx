"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChatNotificationsStore } from "@/store/chat-notifications.store";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getEcho } from "@/lib/echo";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster, toast } from "sonner";
import { useRef } from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setHasUnreadMessages } = useChatNotificationsStore();
  const { user, loading } = useAuthStore();
const audioRef = useRef<HTMLAudioElement | null>(null);
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const {
    workspace,
    loadWorkspace,
    loading: workspaceLoading,
  } = useWorkspaceStore();

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification-chat.mp3");
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reiniciar si ya estaba sonando
      audioRef.current.play().catch(err => console.log("Audio block: ", err));
    }
  };

  // 🔒 Si no hay sesión → login
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
    }
  }, [loading, user]);

  // 📦 Cargar workspace si existe UID
  useEffect(() => {
    if (!workspaceUid) return;
    if (!user) return;

    loadWorkspace(workspaceUid);
  }, [workspaceUid, user]);

  useEffect(() => {
    if (!user) return;
    const echo = getEcho();
    if (!echo) return;

    const channelName = `user.${user.id}`;
    const channel = echo.private(channelName);

    channel.listen(".message.sent", (e: any) => {
      if (e.message.sender_id !== user.id) {
        playNotificationSound();

        // 🔥 Si NO estamos en la página de chat, activamos el puntito azul
        if (!pathname.includes("/chat")) {
          setHasUnreadMessages(true);
        }

        toast.info(`Nuevo mensaje de ${e.message.sender.name}`, {
          description: e.message.body,
          action: {
            label: "Ver",
            onClick: () => {
              setHasUnreadMessages(false);
              router.push(`/dashboard/${workspaceUid}/chat`);
            },
          },
        });
      }
    });

    return () => {
      channel.stopListening(".message.sent");
    };
  }, [user, workspaceUid, router, pathname, setHasUnreadMessages]);

  useEffect(() => {
    if (pathname.includes("/chat")) {
      setHasUnreadMessages(false);
    }
  }, [pathname, setHasUnreadMessages]);

  // ⏳ Loading auth
  if (loading) {
    return <div className="p-6">Verificando sesión...</div>;
  }

  // 🚫 No render si no hay usuario
  if (!user) return null;

  // ⏳ Loading workspace
  if (workspaceLoading) {
    return <div className="p-6">Cargando workspace...</div>;
  }

  // 🚫 Workspace inválido
  if (!workspace) {
    router.push("/workspaces");
    return null;
  }

  return (
    <SidebarProvider
    defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />
        <Toaster richColors position="top-center" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
