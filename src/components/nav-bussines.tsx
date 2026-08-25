"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function NavBussines({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: boolean;
  }[];
}) {
  const { state } = useSidebar();
  const pathname = usePathname();

  const isCollapsed = state === "collapsed";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarGroup>
         <SidebarGroupLabel>Business</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-5">
          <SidebarMenu>
            {items.map((item) => {
              const isActive =
                item.title === "Dashboard"
                  ? pathname === item.url
                  : pathname === item.url ||
                  (item.url !== "#" && pathname.startsWith(item.url + "/"));

              return (
                <SidebarMenuItem
                  key={item.title}
                  className="py-2"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
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
                        tooltip={item.title}
                        isActive={isActive}

                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-2 w-full"
                        >
                          {item.icon && (
                            <item.icon className="h-4 w-4" />
                          )}

                          <span>{item.title}</span>

                          {item.badge && (
                            <span className="absolute right-2 top-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>

                    {isCollapsed && (
                      <TooltipContent
                        side="right"
                        align="center"
                        className="flex items-center gap-2"
                      >
                        {item.title}

                        {item.badge && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        )}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </TooltipProvider>
  );
}