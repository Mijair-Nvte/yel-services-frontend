"use client";

import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatAreaProps {
  activeUser: any;
  messages: any[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onDeleteMessage: (id: number) => void;
  onEditMessage: (id: number, text: string) => void; // 🔥 Nueva propiedad
  loading: boolean;
  currentUser: any;
}

export function ChatArea({
  activeUser,
  messages,
  onSendMessage,
  onClearChat,
  onDeleteMessage,
  onEditMessage,
  loading,
  currentUser,
}: ChatAreaProps) {
  // 🔥 Estado para guardar el mensaje que estamos editando actualmente
  const [editingMessage, setEditingMessage] = useState<any | null>(null);

  // 🔥 Decide si crea un mensaje nuevo o edita uno existente
  const handleSendOrEdit = (text: string) => {
    if (editingMessage) {
      onEditMessage(editingMessage.id, text);
      setEditingMessage(null); // Limpiar el estado tras enviar
    } else {
      onSendMessage(text);
    }
  };

  return (
   <div className="flex h-full flex-col bg-background overflow-hidden relative">
      <ChatHeader user={activeUser} onClearChat={onClearChat} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Cargando mensajes...
        </div>
      ) : (
        <MessageList
          messages={messages}
          currentUser={currentUser}
          onDelete={onDeleteMessage}
          onEdit={(msg) => setEditingMessage(msg)} 
        />
      )}

      <MessageInput
        onSend={handleSendOrEdit}
        editingMessage={editingMessage} 
        onCancelEdit={() => setEditingMessage(null)} 
      />
    </div>
  );
}
