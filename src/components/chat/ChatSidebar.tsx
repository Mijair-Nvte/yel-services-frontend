"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgCompanyService } from "@/services/org_company/org-company.service";
import { TeamDirectory } from "./TeamDirectory";
import { ChatItem } from "./ChatItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSidebarProps {
  activeUser: any;
  onSelectUser: (user: any) => void;
  conversations?: any[]; // 🔥 Nuevo prop
  currentUser?: any; // 🔥 Nuevo prop
}

export function ChatSidebar({
  activeUser,
  onSelectUser,
  conversations = [],
  currentUser,
}: ChatSidebarProps) {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    if (!workspaceUid) return;
    const loadTeam = async () => {
      try {
        const data = await OrgCompanyService.team(workspaceUid);
        setTeamMembers(data);
      } catch (error) {
        console.error("Error cargando el equipo:", error);
      } finally {
        setLoadingTeam(false);
      }
    };
    loadTeam();
  }, [workspaceUid]);

  // 🔥 Renderizador dinámico de chats reales
  const renderConversations = () => {
    // Filtro básico de búsqueda en los chats activos
    const filteredChats = conversations.filter((conv) => {
      if (!searchTerm) return true;
      const otherParticipant = conv.participants.find(
        (p: any) => p.user_id !== currentUser?.id,
      );
      const name = otherParticipant?.user?.name?.toLowerCase() || "";
      return name.includes(searchTerm.toLowerCase());
    });

    if (filteredChats.length === 0) {
      return (
        <p className="text-center text-xs text-muted-foreground mt-4">
          {searchTerm ? "No se encontraron chats" : "No hay chats recientes"}
        </p>
      );
    }

    return filteredChats.map((conv) => {
      // Encontrar al otro usuario en esta conversación
      const otherParticipant = conv.participants.find(
        (p: any) => p.user_id !== currentUser?.id,
      );
      if (!otherParticipant) return null;
      const otherUser = otherParticipant.user;

      const lastMessage = conv.last_message; // Relación from Backend

      // Lógica de Vistos: ¿El ID del último msj es mayor al que yo leí? (y no fui yo quien lo mandó)
      const myParticipant = conv.participants.find(
        (p: any) => p.user_id === currentUser?.id,
      );
      const isUnread =
        lastMessage &&
        myParticipant &&
        lastMessage.id > (myParticipant.last_read_message_id || 0) &&
        lastMessage.sender_id !== currentUser?.id;

      return (
        <ChatItem
          key={conv.id}
          user={otherUser}
          lastMessage={lastMessage}
          isUnread={!!isUnread}
          active={activeUser?.id === otherUser.id}
          onClick={() => onSelectUser(otherUser)}
        />
      );
    });
  };

  return (
    <div className="flex w-80 flex-col border-r bg-muted/10 shrink-0">
      <div className="flex items-center justify-between border-b p-4 h-16 shrink-0">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <MessageSquare className="h-5 w-5" />
          Mensajes
        </h2>
      </div>

      <div className="border-b p-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="chats"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="px-4 pt-2 shrink-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="team">Iniciar Chat</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="chats"
          className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
        >
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
              {/* 🔥 Aquí llamamos a la función que pinta los reales */}
              {renderConversations()}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="team"
          className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
        >
          <TeamDirectory
            searchTerm={searchTerm}
            members={teamMembers}
            loading={loadingTeam}
            activeUser={activeUser}
            onSelectUser={onSelectUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
