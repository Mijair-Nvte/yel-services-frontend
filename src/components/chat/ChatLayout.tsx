"use client";

import { useState } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { MessageSquare } from "lucide-react";

export function ChatLayout() {
  // Estado para saber con quién estamos chateando
  const [activeUser, setActiveUser] = useState<any | null>(null);

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl border bg-background shadow-sm">
      <ChatSidebar activeUser={activeUser} onSelectUser={setActiveUser} />
      <div className="flex flex-1 flex-col min-w-0">
        {activeUser ? (
          <ChatArea activeUser={activeUser} />
        ) : (
          // Empty State: Lo que se ve cuando no hay chat seleccionado
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-muted/10 text-muted-foreground">
            <div className="rounded-full bg-muted p-6">
              <MessageSquare className="h-10 w-10" />
            </div>
            <p className="text-sm font-medium">
              Selecciona un chat o contacto para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
