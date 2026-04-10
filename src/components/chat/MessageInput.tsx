"use client";

import { useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text.trim());
    setText(""); // Limpiar el input después de enviar
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enviar con Enter (sin Shift, para permitir saltos de línea con Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
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
  );
}