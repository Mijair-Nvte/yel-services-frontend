"use client";

import Link from "next/link";
import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    exact?: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
         <SidebarGroupLabel>Configuracion</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.exact
              ? pathname === item.url
              : pathname === item.url ||
                (item.url !== "#" &&
                  pathname.startsWith(item.url + "/"));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className="
                    relative
                    transition-all
                    duration-200
                    ease-out
                    hover:translate-x-0.5
                    hover:shadow-[0_2px_8px_rgba(236,72,153,0.10)]
                    data-[active=true]:bg-gradient-to-r
                    data-[active=true]:from-pink-500
                    data-[active=true]:to-pink-600
                    data-[active=true]:text-white
                    data-[active=true]:shadow-[0_4px_16px_rgba(236,72,153,0.20)]
                  "
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-2 w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}