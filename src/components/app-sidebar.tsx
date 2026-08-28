
"use client";

import * as React from "react";

import { useWorkspaceStore } from "@/store/workspace.store";
import { NavMain } from "@/components/nav-main";
import Logo from "@/assets/logoytl.png"
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
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
  Package,
  Clock,
  ShieldCheck,
  KanbanSquare,
  HandCoins,
  FileText,
  SquareTerminal,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { NavBussines } from "./nav-bussines";

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

  const { setOpen, isMobile } = useSidebar();

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
      title: "Pipeline de Servicios",
      url: workspace ? `/dashboard/${workspace.uid}/service-orders` : "#",
      icon: KanbanSquare,
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
      title: "Control de Tiempo",
      url: workspace ? `/dashboard/${workspace.uid}/time-tracking` : "#",
      icon: Clock,
      requiredPermission: "view_time_tracking",
    },
  ];

  const rawNavBussines = [


    {
      title: "Ventas y Comisiones",
      url: workspace ? `/dashboard/${workspace.uid}/sales` : "#",
      icon: BadgeDollarSign,
      requiredPermission: "view_sales",
    },
    {
      title: "Afiliados",
      url: workspace ? `/dashboard/${workspace.uid}/partners` : "#",
      icon: HandCoins,

    },
    {
      title: "Servicios",
      url: workspace ? `/dashboard/${workspace.uid}/services` : "#",
      icon: Package,
      requiredPermission: "view_services",
    },
    {
      title: "Seguros",
      url: workspace ? `/dashboard/${workspace.uid}/insurance` : "#",
      icon: ShieldCheck, // Icono de protección/seguro
    },
    {
      title: "Prestamos",
      url: workspace ? `/dashboard/${workspace.uid}/loans` : "#",
      icon: FileText,
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

  const handleMouseEnter = () => {
    // Si estamos en móvil, no queremos este comportamiento de hover
    if (!isMobile) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpen(false);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >

      <Sidebar collapsible="icon"  {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link
                href={`/dashboard/${workspace?.uid}`}
                className="flex items-center justify-center py-2 overflow-hidden"
              >
                {/* ✅ LOGO COMPLETO: Se muestra expandido, se oculta cuando el sidebar está colapsado */}
                <div className="flex items-center justify-center group-data-[collapsible=icon]:hidden">
                  <Image src={Logo} width={160} alt="YEL GROUP" priority />
                </div>

                {/* ✅ INICIALES / LOGO REDUCIDO: Se muestra EXCLUSIVAMENTE cuando está colapsado */}
                <span className="hidden group-data-[collapsible=icon]:flex items-center justify-center h-10 w-10 font-black text-pink-600  text-lg tracking-wider ">
                  YG
                </span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator ></SidebarSeparator>
        <SidebarContent className=" text-xl font-semibold">
          {/* Renderizamos los arreglos ya filtrados */}
          <NavMain items={navMain} />
          <NavBussines items={rawNavBussines}></NavBussines>
          <NavSecondary items={navSecondary} className="mt-auto" />
        </SidebarContent>

        <SidebarFooter></SidebarFooter>
      </Sidebar>
    </div>
  );
}
