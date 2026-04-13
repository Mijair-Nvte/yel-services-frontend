"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/chat/use-chat";
import { useAuthStore } from "@/store/auth.store";

export function ChatLayout() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { user } = useAuthStore();
  const [activeUser, setActiveUser] = useState<any | null>(null);

  const { 
    conversations, 
    messages, 
    loadingMessages,
    openDirectChat, 
    sendMessage,
    clearChat,
    deleteMessage,
    editMessage
  } = useChat(workspaceUid as string);

  const handleSelectUser = (selectedUser: any) => {
    setActiveUser(selectedUser);
    openDirectChat(selectedUser);
  };

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl border bg-background shadow-sm">
      <ChatSidebar 
        activeUser={activeUser} 
        onSelectUser={handleSelectUser} 
        conversations={conversations} // 🔥 Pasamos los chats reales
        currentUser={user} // 🔥 Pasamos el usuario para lógica de "vistos"
      />
      
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {activeUser ? (
          <ChatArea 
            activeUser={activeUser} 
            messages={messages} 
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            onDeleteMessage={deleteMessage}
            loading={loadingMessages}
            onEditMessage={editMessage}
            currentUser={user}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-muted/10 text-muted-foreground">
            <div className="rounded-full bg-muted p-6">
              <MessageSquare className="h-10 w-10" />
            </div>
            <p className="text-sm font-medium">
              Selecciona un contacto para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}