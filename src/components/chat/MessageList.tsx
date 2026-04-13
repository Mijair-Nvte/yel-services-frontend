import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: any[];
  currentUser: any;
  onDelete: (id: number) => void;
  onEdit: (msg: any) => void; // 🔥 Propiedad añadida aquí
}

export function MessageList({ messages, currentUser, onDelete, onEdit }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll hacia abajo cuando llegan nuevos mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isSender={currentUser?.id === msg.sender_id}
            time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            onDelete={() => onDelete(msg.id)}
            onEdit={() => onEdit(msg)} // 🔥 Pasamos el mensaje hacia arriba
          />
        ))}
        {/* Div invisible para el auto-scroll */}
      <div ref={scrollRef} /> 
      </div>
    </div>
  );
}