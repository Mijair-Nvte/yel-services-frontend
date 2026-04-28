// C:\YEL\yel-services-frontend\src\components\nav-user.tsx
"use client";

import { IconLogout, IconUserCircle, IconChevronDown } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string; // Opcional, por si quieres mostrar "Super Admin"
  };
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const initial = user.name?.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 px-2 py-1.5 outline-none hover:bg-accent rounded-lg transition-colors">
          <Avatar className="h-9 w-9 border">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold leading-none">{user.name}</span>
            <span className="text-[11px] text-muted-foreground mt-1 uppercase font-medium tracking-tight">
              {user.role || "Admin"}
            </span>
          </div>
          <IconChevronDown className="ml-1 size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/${workspaceUid}/account`}>
              <IconUserCircle className="mr-2 size-4" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <IconLogout className="mr-2 size-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}