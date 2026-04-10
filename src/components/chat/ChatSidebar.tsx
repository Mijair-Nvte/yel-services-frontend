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
}

export function ChatSidebar({ activeUser, onSelectUser }: ChatSidebarProps) {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para el equipo (Movidos aquí para que no se recarguen al cambiar de tab)
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

  // Mock de chats (podemos usar a los mismos usuarios del team para simular)
  const mockChats = teamMembers.slice(0, 2);

  return (
    <div className="flex w-80 flex-col border-r bg-muted/10">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <MessageSquare className="h-5 w-5" />
          Mensajes
        </h2>
      </div>

      <div className="border-b p-4">
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
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="team">Directorio</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="chats"
          className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
        >
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
              {mockChats.length > 0 ? (
                mockChats.map((member) => (
                  <ChatItem
                    key={member.id}
                    user={member.user}
                    active={activeUser?.id === member.user.id}
                    onClick={() => onSelectUser(member.user)}
                  />
                ))
              ) : (
                <p className="text-center text-xs text-muted-foreground mt-4">
                  No hay chats recientes
                </p>
              )}
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
