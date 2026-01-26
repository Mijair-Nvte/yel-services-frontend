"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFolder,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconInnerShadowTop,
} from "@tabler/icons-react";

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
import { Calendar, Megaphone, Paperclip } from "lucide-react";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { workspace } = useWorkspaceStore();

  const navMain = [
    {
      title: "Dashboard",
      url: workspace ? `/dashboard/${workspace.uid}` : "#",
      icon: IconDashboard,
    },
    {
      title: "Departamentos",
      url: workspace ? `/dashboard/${workspace.uid}/departments` : "#",
      icon: IconFolder,
    },
    {
      title: "Avisos",
      url: workspace ? `/dashboard/${workspace.uid}/notices` : "#",
      icon: Megaphone,
    },
    {
      title: "Ventos/Calendario",
      url: workspace ? `/dashboard/${workspace.uid}/team` : "#",
      icon: Calendar,
    },

    {
      title: "Recursos generales",
      url: workspace ? `/dashboard/${workspace.uid}/team` : "#",
      icon: Paperclip,
    },
    {
      title: "Equipo",
      url: workspace ? `/dashboard/${workspace.uid}/team` : "#",
      icon: IconUsers,
    },
  ];

  const navSecondary = [
    {
      title: "Configuracion",
      url: workspace ? `/dashboard/${workspace.uid}/settings` : "#",
      icon: IconSettings,
    },
    {
      title: "Ayudar",
      url: "#",
      icon: IconHelp,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="!p-1.5">
              <a href="#">
                <h1 className="text-white text-xl  font-semibold">
                  {workspace?.name ?? "Workspace"}
                </h1>
              </a>
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
            name: "User",
            email: "user@email.com",
            avatar: "/avatars/user.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
