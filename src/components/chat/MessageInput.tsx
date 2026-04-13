"use client";

import { useState, useEffect } from "react";
import { Paperclip, Send, Smile, Edit2, X } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSend: (text: string) => void;
  editingMessage?: any | null; // 🔥 Puede recibir un mensaje para editar
  onCancelEdit?: () => void; // 🔥 Función para salir del modo edición
}

export function MessageInput({ onSend, editingMessage, onCancelEdit }: MessageInputProps) {
  const [text, setText] = useState("");

  // 🔥 Si entra un mensaje para editar, pon su texto en el input
  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.body);
    } else {
      setText("");
    }
  }, [editingMessage]);

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text.trim());
    setText(""); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background flex flex-col">
      {/* 🔥 Barra de "Editando" */}
      {editingMessage && (
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b border-border/50">
          <div className="flex items-center gap-2">
            <Edit2 className="h-3 w-3" />
            <span>Editando mensaje...</span>
          </div>
          <button onClick={onCancelEdit} className="hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-end gap-2 rounded-xl border bg-muted/30 p-2 focus-within:ring-1 focus-within:ring-ring">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <Textarea
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[40px] max-h-[120px] flex-1 resize-none border-0 bg-transparent p-2 text-sm shadow-none focus-visible:ring-0"
            rows={1}
          />
          
          <div className="flex shrink-0 items-center gap-1 pb-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Smile className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!text.trim()}
              size="icon" 
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}