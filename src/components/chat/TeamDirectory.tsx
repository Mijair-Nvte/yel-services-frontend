"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TeamDirectoryProps {
  searchTerm: string;
  members: any[];
  loading: boolean;
  activeUser: any;
  onSelectUser: (user: any) => void;
}

export function TeamDirectory({ searchTerm, members, loading, activeUser, onSelectUser }: TeamDirectoryProps) {
  const filteredMembers = members.filter((member) => {
    if (!searchTerm) return true;
    const user = member.user;
    if (!user) return false;

    const term = searchTerm.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    const name = user.name?.toLowerCase() || ""; 

    return email.includes(term) || name.includes(term);
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <span className="text-sm text-muted-foreground">Cargando directorio...</span>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-1 p-2">
        {filteredMembers.map((member) => {
          const user = member.user;
          if (!user) return null; 

          const isActive = activeUser?.id === user.id;

          return (
            <button
              key={member.id}
              onClick={() => onSelectUser(user)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
                isActive && "bg-muted"
              )}
            >
              <Avatar>
                <AvatarImage src={user.avatar_url || ""} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <span className="block truncate text-sm font-medium">{user.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}