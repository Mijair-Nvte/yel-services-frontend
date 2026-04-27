"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store"; // 🔥 Importamos el store

interface TeamDirectoryProps {
  searchTerm: string;
  members: any[];
  loading: boolean;
  activeUser: any;
  onSelectUser: (user: any) => void;
}

export function TeamDirectory({ searchTerm, members, loading, activeUser, onSelectUser }: TeamDirectoryProps) {
  const { user: currentUser } = useAuthStore(); // 🔥 Obtenemos el usuario logueado

  const filteredMembers = members.filter((member) => {
    // 🔥 Ya no buscamos member.user, el propio 'member' trae los datos
    if (!member) return false;

    // 1. 🔥 EXCLUIR NUESTRO PROPIO USUARIO
    if (member.id === currentUser?.id) return false;

    // 2. Filtrar por término de búsqueda
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      member.email?.toLowerCase().includes(term) || 
      member.name?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <span className="text-sm text-blue-600 animate-pulse font-medium">
          Cargando directorio...
        </span>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-1 p-2">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => {
            // 🔥 Usamos directamente 'member' para todo
            const isActive = activeUser?.id === member.id;
            const initials = member.name?.substring(0, 2).toUpperCase() || "U";

            return (
              <button
                key={member.id}
                onClick={() => onSelectUser(member)} // 🔥 Pasamos el member plano
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all",
                  isActive ? "bg-blue-50 border-blue-100 shadow-sm" : "hover:bg-muted/50"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={member.avatar_url || member.avatar || ""} 
                    alt={member.name} 
                    className="object-cover" 
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <span className={cn(
                    "block truncate text-sm font-medium", 
                    isActive ? "text-blue-900" : "text-foreground"
                  )}>
                    {member.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {member.email}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <p className="text-center text-xs text-muted-foreground mt-4">
            No se encontraron otros miembros
          </p>
        )}
      </div>
    </ScrollArea>
  );
}