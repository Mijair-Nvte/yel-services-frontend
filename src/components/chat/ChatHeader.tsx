"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  user: any;
  onClearChat: () => void;
}

export function ChatHeader({ user, onClearChat }: ChatHeaderProps) {
  // Por si el componente se renderiza antes de tener al usuario
  if (!user) return null;

  // Generar iniciales dinámicas para el avatar
  const initials = user.name?.substring(0, 2).toUpperCase() || "U";

  // 🔥 LÓGICA DE IMAGEN UNIFICADA
  // Buscamos en profile.avatar_url (relación de Laravel) o directamente en el usuario
  const avatarSrc = user.profile?.avatar_url || user.avatar_url || user.avatar || "";

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-blue-100">
            <AvatarImage src={avatarSrc} alt={user.name} className="object-cover" />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Indicador de estado */}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-blue-950 leading-none">
            {user.name}
          </h3>
          <p className="text-[11px] font-medium text-green-600 mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            En línea
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Menú de opciones del chat */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 text-blue-900/70 hover:text-blue-900">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <DropdownMenuItem 
              onClick={onClearChat}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-md flex items-center gap-2 p-2.5"
            >
              <Trash2 className="h-4 w-4" />
              <span className="font-medium">Vaciar historial del chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}