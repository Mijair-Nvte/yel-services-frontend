import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

export function MessageList() {
  return (
    <ScrollArea className="flex-1 p-6">
      <div className="flex flex-col gap-4">
        <div className="my-4 text-center text-xs text-muted-foreground">
          Hoy, 10:30 AM
        </div>
        <MessageBubble
          isSender={false}
          text="Hola, ¿cómo va la integración en Next.js?"
          time="10:31 AM"
        />
        <MessageBubble
          isSender={true}
          text="¡Todo excelente! Ya estoy montando la estructura de la UI."
          time="10:35 AM"
        />
        <MessageBubble
          isSender={false}
          text="Perfecto. Me avisas cuando necesites conectar Pusher y Laravel para mandar los eventos."
          time="10:40 AM"
        />
      </div>
    </ScrollArea>
  );
}
