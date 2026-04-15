"use client";

import Link from "next/link";
import { Mail, Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // Importamos el hook
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: boolean;
  }[];
}) {
  const { state } = useSidebar(); // Obtenemos el estado (expanded o collapsed)
  const isCollapsed = state === "collapsed";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-5">
          {/* Quick Create */}
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Quick Create"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear"
                  >
                    <Plus className="hover:text-white"> </Plus>
                    <span className="hover:text-white">Creador</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {/* Solo se muestra si está colapsado */}
                {isCollapsed && (
                  <TooltipContent side="right" align="center">
                    Quick Create
                  </TooltipContent>
                )}
              </Tooltip>

              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:hidden transition-all"
                variant="outline"
              >
                <Mail className="text-black" />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Navigation Links */}
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title} className="py-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild className="relative" tooltip={item.title}>
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>

                        {/* 🔥 INDICADOR DE MENSAJE NUEVO (BADGE) */}
                        {item.badge && (
                          <span className="absolute right-2 top-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></span>
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  
                  {/* 🔥 Solo renderiza el contenido del Tooltip si el sidebar está cerrado */}
                  {isCollapsed && (
                    <TooltipContent side="right" align="center" className="flex items-center gap-2">
                      {item.title}
                      {item.badge && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </TooltipProvider>
  );
}