import { cn } from "@/lib/utils";
import { Trash2, Edit2 } from "lucide-react";

interface MessageBubbleProps {
  isSender: boolean;
  message: any;
  time: string;
  onDelete: () => void;
  onEdit: () => void; // 🔥 Propiedad añadida aquí
}

export function MessageBubble({ isSender, message, time, onDelete, onEdit }: MessageBubbleProps) {
  // 🔥 Saber si fue editado comparando fechas (opcional, para la UI)
const isEdited = message.updated_at && message.created_at && message.updated_at !== message.created_at;

  return (
    <div className={cn("flex w-full group", isSender ? "justify-end" : "justify-start")}>
      <div className="flex items-center gap-2">
        
        {/* Controles: Editar y Borrar (solo visible para el emisor en hover) */}
        {isSender && (
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={onEdit} // 🔥 Al hacer clic activa el modo edición
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary transition-colors"
              title="Editar mensaje"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-destructive transition-colors"
              title="Eliminar mensaje"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}

        <div
          className={cn(
            "flex max-w-[70%] flex-col gap-1 px-4 py-2 text-sm relative",
            isSender
              ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-2xl rounded-tl-sm bg-muted text-foreground"
          )}
        >
          <p>{message.body}</p>
          <div className="flex items-center justify-end gap-1">
            {isEdited && (
              <span className={cn(
                "text-[9px] italic opacity-70",
                isSender ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                (editado)
              </span>
            )}
            <span
              className={cn(
                "text-[10px]",
                isSender ? "text-primary-foreground/80" : "text-muted-foreground"
              )}
            >
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}