import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  isSender: boolean;
  text: string;
  time: string;
}

export function MessageBubble({ isSender, text, time }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full", isSender ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-1 px-4 py-2 text-sm",
          isSender
            ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-2xl rounded-tl-sm bg-muted text-foreground"
        )}
      >
        <p>{text}</p>
        <span
          className={cn(
            "text-[10px] text-right",
            isSender ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {time}
        </span>
      </div>
    </div>
  );
}