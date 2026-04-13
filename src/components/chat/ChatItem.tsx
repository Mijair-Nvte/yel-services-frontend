import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  user: any;
  lastMessage?: any;
  isUnread?: boolean;
  active?: boolean;
  onClick: () => void;
}

export function ChatItem({ user, lastMessage, isUnread, active, onClick }: ChatItemProps) {
  if (!user) return null;

  const initials = user.name?.substring(0, 2).toUpperCase() || "U";
  

  const avatarSrc = user.profile?.avatar_url || user.avatar_url || user.avatar || "";

  const timeString = lastMessage 
    ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 border border-transparent",
        active ? "bg-blue-50 border-blue-100 shadow-sm" : "hover:bg-muted/60"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className={cn("h-11 w-11", active && "ring-2 ring-blue-200 ring-offset-2")}>
          <AvatarImage src={avatarSrc} alt={user.name} className="object-cover" />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Indicador de estado (puedes hacerlo dinámico luego con Presence Channels) */}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span 
            className={cn(
              "truncate text-sm transition-colors", 
              isUnread ? "font-bold text-blue-900" : (active ? "font-semibold text-blue-900" : "font-medium text-foreground")
            )}
          >
            {user.name}
          </span>
          {timeString && (
            <span 
              className={cn(
                "text-[10px] whitespace-nowrap ml-2", 
                isUnread ? "text-blue-600 font-bold" : "text-muted-foreground"
              )}
            >
              {timeString}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p 
            className={cn(
              "truncate text-xs flex-1 transition-colors", 
              isUnread ? "font-semibold text-blue-800/90" : "text-muted-foreground"
            )}
          >
            {lastMessage ? lastMessage.body : "Comienza a chatear..."}
          </p>
          
          {isUnread && (
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0 shadow-sm shadow-blue-200"></span>
          )}
        </div>
      </div>
    </button>
  );
}