// C:\YEL\yel-services-frontend\src\components\app-sidebar.tsx
"use client";

import * as React from "react";

import { useWorkspaceStore } from "@/store/workspace.store";
import { NavMain } from "@/components/nav-main";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderTree,
  Users,
  Settings,
  HelpCircle,
  Megaphone,
  File,
  Link2,
  Link2Icon,
  Calendar1,
  BadgeDollarSign,
  MessageCircleMore,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

const getInitials = (name?: string) => {
  if (!name) return "WS"; // Por defecto si no hay nombre
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {

  const { workspace, hasPermission } = useWorkspaceStore();
  const user = useAuthStore((state) => state.user);
  

  // ✅ 2. Agregamos "requiredPermission" a cada item
  const rawNavMain = [
    {
      title: "Dashboard",
      url: workspace ? `/dashboard/${workspace.uid}` : "#",
      icon: LayoutDashboard,
      requiredPermission: "view_dashboard",
    },
    {
      title: "Departamentos",
      url: workspace ? `/dashboard/${workspace.uid}/departments` : "#",
      icon: FolderTree,
      requiredPermission: "view_areas",
    },
    {
      title: "Calendario",
      url: workspace ? `/dashboard/${workspace.uid}/calendar` : "#",
      icon: Calendar1,
      requiredPermission: "view_calendar",
    },
    {
      title: "Avisos",
      url: workspace ? `/dashboard/${workspace.uid}/notices` : "#",
      icon: Megaphone,
      requiredPermission: "view_notices",
    },
    {
      title: "Links",
      url: workspace ? `/dashboard/${workspace.uid}/links` : "#",
      icon: Link2Icon,
      requiredPermission: "view_company_links",
    },
   
    {
      title: "Archivos",
      url: workspace ? `/dashboard/${workspace.uid}/resources` : "#",
      icon: File,
      requiredPermission: "view_documents",
    },
    {
      title: "Equipo",
      url: workspace ? `/dashboard/${workspace.uid}/team` : "#",
      icon: Users,
      requiredPermission: "view_users",
    },
    {
      title: "Ventas y Comisiones",
      url: workspace ? `/dashboard/${workspace.uid}/sales` : "#",
      icon: BadgeDollarSign,
      requiredPermission: "view_sales",
    },
    {
      title: "Mapeo de Enlaces",
      url: workspace ? `/dashboard/${workspace.uid}/link-mappings` : "#",
      icon: Link2,
      requiredPermission: "view_payment_links",
    },
  ];

  const rawNavSecondary = [
    {
      title: "Configuración",
      url: workspace ? `/dashboard/${workspace.uid}/settings` : "#",
      icon: Settings,
      // Si quieres que solo admins vean Configuración, le pones manage_users o similar.
      // Si no pones requiredPermission, todos lo verán.
      requiredPermission: "manage_users",
    },
    {
      title: "Ayuda",
      url: "#",
      icon: HelpCircle,
      // Al no tener requiredPermission, siempre se mostrará
    },
  ];


  const navMain = rawNavMain.filter(
    (item) =>
      !item.requiredPermission || hasPermission(item.requiredPermission),
  );

  const navSecondary = rawNavSecondary.filter(
    (item) =>
      !item.requiredPermission || hasPermission(item.requiredPermission),
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href={`/dashboard/${workspace?.uid}`}
              // Añadimos un pequeño flex para centrar las iniciales cuando esté colapsado
              className="flex items-center justify-center py-2"
            >
              {/* ✅ TEXTO COMPLETO: Se oculta en modo ícono */}
              <span className="text-white text-xl font-semibold group-data-[collapsible=icon]:hidden">
                {workspace?.name ?? "Workspace"}
              </span>

              {/* ✅ INICIALES: Se muestran solo en modo ícono */}
              <span className="text-white text-xl font-bold hidden group-data-[collapsible=icon]:block truncate">
                {getInitials(workspace?.name)}
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="text-white text-xl font-semibold">
        {/* Renderizamos los arreglos ya filtrados */}
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  );
}
