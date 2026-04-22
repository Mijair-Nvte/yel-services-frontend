"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OrgMemberService } from "@/services/org_team/org-member.service"; // CORREGIDO
import { InviteMemberModal } from "@/components/org_team/invite-member-modal";
import { EditMemberPanel } from "@/components/org_team/edit-member-panel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  ShieldAlert,
  Shield,
  User as UserIcon,
  Settings2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingsTeamPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const loadTeam = async () => {
    if (!workspaceUid) return;
    setLoading(true);
    try {
      const data = await OrgMemberService.getAll(workspaceUid); // CORREGIDO
      setMembers(data);
    } catch (error) {
      toast.error("Error al cargar el equipo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [workspaceUid]);

  const handleRemove = async (member: any) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar a ${member.user.name || member.user.email} de la compañía?`,
      )
    )
      return;

    try {
      await OrgMemberService.remove(workspaceUid, member.id); // CORREGIDO
      toast.success("Usuario eliminado del equipo");
      loadTeam();
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar usuario");
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Administración del Equipo
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los accesos, roles y permisos detallados de tu compañía.
          </p>
        </div>

        <InviteMemberModal workspaceUid={workspaceUid} />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Directorio de Usuarios</CardTitle>
          <CardDescription>
            Usuarios con acceso activo al workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8 text-sm text-muted-foreground animate-pulse">
              Cargando directorio...
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol Base</TableHead>
                    <TableHead>Fecha de Ingreso</TableHead>
                    <TableHead className="text-right">Gestión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="font-medium text-sm text-foreground">
                          {member.user?.name || "Usuario Pendiente"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.user?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.role === "owner"
                              ? "default"
                              : member.role === "admin"
                                ? "secondary"
                                : "outline"
                          }
                          className="capitalize"
                        >
                          {member.role === "owner" && (
                            <ShieldAlert className="mr-1 h-3 w-3" />
                          )}
                          {member.role === "admin" && (
                            <Shield className="mr-1 h-3 w-3" />
                          )}
                          {(member.role === "member" ||
                            member.role === "user") && (
                            <UserIcon className="mr-1 h-3 w-3" />
                          )}
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(member.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {member.role !== "owner" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/${workspaceUid}/settings/team/${member.id}`,
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <Settings2 className="mr-2 h-4 w-4" />
                                Gestionar Perfil y Permisos
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                onClick={() => handleRemove(member)}
                              >
                                Eliminar del equipo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {members.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No hay miembros registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isEditSheetOpen && selectedMemberId && (
        <EditMemberPanel
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          workspaceUid={workspaceUid as string}
          member={members.find((m) => m.id === selectedMemberId)}
        />
      )}
    </div>
  );
}