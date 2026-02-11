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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderTree,
  Users,
  Settings,
  HelpCircle,
  Paperclip,
  Megaphone,
  Calendar,
  File,
  Clipboard,
  Link2,
  Link2Icon,
  Calendar1,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { workspace } = useWorkspaceStore();
 const user = useAuthStore((state) => state.user);
  const navMain = [
    {
      title: "Dashboard",
      url: workspace ? `/dashboard/${workspace.uid}` : "#",
      icon: LayoutDashboard, // Equivalente a IconDashboard
    },
    {
      title: "Departamentos",
      url: workspace ? `/dashboard/${workspace.uid}/departments` : "#",
      icon: FolderTree, // Equivalente a IconFolder
    },
      {
      title: "Calendario",
      url: workspace ? `/dashboard/${workspace.uid}/calendar` : "#",
      icon: Calendar1,
    },
    {
      title: "Avisos",
      url: workspace ? `/dashboard/${workspace.uid}/notices` : "#",
      icon: Megaphone,
    },
    {
      title: "Links", // Corregido el typo de "Ventos"
      url: workspace ? `/dashboard/${workspace.uid}/links` : "#",
      icon: Link2Icon,
    },
    {
      title: "Archivos",
      url: workspace ? `/dashboard/${workspace.uid}/resources` : "#",
      icon: File,
    },
    {
      title: "Equipo",
      url: workspace ? `/dashboard/${workspace.uid}/team` : "#",
      icon: Users, // Equivalente a IconUsers
    },
  ];

  const navSecondary = [
    {
      title: "Configuración",
      url: workspace ? `/dashboard/${workspace.uid}/settings` : "#",
      icon: Settings, // Equivalente a IconSettings
    },
    {
      title: "Ayuda",
      url: "#",
      icon: HelpCircle, // Equivalente a IconHelp
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="!p-1.5">
              <Link href={`/dashboard/${workspace?.uid}`}>
                <h1 className="text-white text-xl font-semibold">
                  {workspace?.name ?? "Workspace"}
                </h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="text-white">
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Usuario",
            email: user?.email ?? "",
            avatar: user?.avatar ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
