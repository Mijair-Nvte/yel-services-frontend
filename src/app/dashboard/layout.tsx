"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading } = useAuthStore();

  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const {
    workspace,
    loadWorkspace,
    loading: workspaceLoading,
  } = useWorkspaceStore();

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
        <Toaster richColors position="top-right" />
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
