import { ChatLayout } from "@/components/chat/ChatLayout";

export default function ChatPage() {
  return (
    // Ajusta el "h-[calc(100vh-4rem)]" dependiendo del tamaño del navbar superior de tu dashboard.
    <div className="h-[calc(100vh-4rem)] w-full p-4">
      <ChatLayout />
    </div>
  );
}