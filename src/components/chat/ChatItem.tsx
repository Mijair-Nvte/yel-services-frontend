import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  user: any;
  active?: boolean;
  onClick: () => void;
}

export function ChatItem({ user, active, onClick }: ChatItemProps) {
  // Por si llega a pasar un usuario indefinido
  if (!user) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
        active && "bg-muted"
      )}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={user.avatar_url || ""} alt={user.name} />
          <AvatarFallback>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {/* Indicador de estado en línea (puedes hacerlo dinámico después) */}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">{user.name}</span>
          {/* Hora simulada, luego la conectarás con la fecha del último mensaje */}
          <span className="text-xs text-muted-foreground">10:42 AM</span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {/* Mensaje simulado, luego lo conectarás con el texto del último mensaje */}
          Toca para abrir el chat...
        </p>
      </div>
    </button>
  );
}