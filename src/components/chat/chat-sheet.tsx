// C:\YEL\yel-services-frontend\src\components\chat\chat-sheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageCircleMore } from "lucide-react";
import { ChatLayout } from "./ChatLayout";
import { useChatNotificationsStore } from "@/store/chat-notifications.store";
import { cn } from "@/lib/utils";

export function ChatSheet() {
  const { hasUnreadMessages } = useChatNotificationsStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="group relative flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 outline-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400">
            <MessageCircleMore className="h-5 w-5" />
          </div>

          {hasUnreadMessages && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-amber-500"></span>
            </span>
          )}
        </button>
      </SheetTrigger>

      {/* Ajustamos el ancho del Sheet para que el chat se vea bien (80vw o max-w) */}
      <SheetContent className="w-full sm:max-w-[500px] md:max-w-[800px] p-0 flex flex-col gap-0 border-l shadow-2xl">
        <SheetHeader className="p-4 border-b sr-only">
          <SheetTitle>Centro de Mensajes</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden h-full">
          <ChatLayout isSheet={true} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
