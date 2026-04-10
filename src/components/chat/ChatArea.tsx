"use client";

import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatAreaProps {
  activeUser: any;
}

export function ChatArea({ activeUser }: ChatAreaProps) {
  // Estado local para simular mensajes enviados
  const [messages, setMessages] = useState([
    { id: 1, text: "Hola, ¿estás por ahí?", isSender: false, time: "10:00 AM" },
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now(),
      text,
      isSender: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <ChatHeader user={activeUser} />
      {/* Pasamos los mensajes al MessageList */}
      <MessageList messages={messages} />
      {/* Le pasamos la función para enviar al input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
