"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrgMemberService } from "@/services/org_team/org-member.service";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const PERMISSION_GROUPS = [
  {
    category: "Dashboard",
    icon: <Shield className="w-4 h-4" />,
    permissions: [{ key: "view_dashboard", label: "Ver Dashboard General" }],
  },
  {
    category: "Equipo y Áreas",
    icon: <User className="w-4 h-4" />,
    permissions: [
      { key: "view_team", label: "Ver Directorio de Equipo" },
      { key: "manage_team", label: "Gestionar Usuarios (Crear/Editar)" },
      { key: "view_areas", label: "Ver Áreas y Posiciones" },
      { key: "manage_areas", label: "Gestionar Áreas" },
    ],
  },
  {
    category: "Ventas y Enlaces",
    icon: <Shield className="w-4 h-4" />,
    permissions: [
      { key: "view_sales", label: "Ver Registro de Ventas" },
      { key: "manage_sales", label: "Gestionar Ventas y Comisiones" },
      { key: "view_payment_links", label: "Ver Links de Pago" },
      { key: "manage_payment_links", label: "Gestionar Links de Pago" },
    ],
  },
  {
    category: "Calendario y Eventos",
    icon: <Shield className="w-4 h-4" />,
    permissions: [
      { key: "view_calendar", label: "Ver Calendario" },
      { key: "manage_calendar", label: "Crear y Editar Eventos" },
    ],
  },
  {
    category: "Comunicación y Archivos",
    icon: <Mail className="w-4 h-4" />,
    permissions: [
      { key: "view_notices", label: "Ver Avisos" },
      { key: "manage_notices", label: "Crear Avisos" },
      { key: "view_documents", label: "Ver Documentos" },
      { key: "manage_documents", label: "Gestionar Documentos" },
      { key: "access_chat", label: "Acceso a Chat Interno" },
    ],
  },
];

export default function EditMemberPage() {
  const router = useRouter();
  const { workspaceUid, memberId } = useParams<{
    workspaceUid: string;
    memberId: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);

  // Estados simplificados solo para roles y permisos
  const [role, setRole] = useState<string>("member");
  const [activePermissions, setActivePermissions] = useState<string[]>([]);

  useEffect(() => {
    loadMember();
  }, [workspaceUid, memberId]);

  const loadMember = async () => {
    try {
      setLoading(true);
      const data = await OrgMemberService.getOne(workspaceUid, memberId);

      setMember(data.member_info);
      setRole(data.spatie_data?.role || "member");
      setActivePermissions(data.spatie_data?.active_permissions || []);
    } catch (error) {
      toast.error("Error al cargar los datos del usuario");
      router.push(`/dashboard/${workspaceUid}/settings`);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (permKey: string, checked: boolean) => {
    if (checked) {
      setActivePermissions((prev) => [...prev, permKey]);
    } else {
      setActivePermissions((prev) => prev.filter((p) => p !== permKey));
    }
  };

  const handleSave = async () => {
    if (!workspaceUid || !memberId) return;

    try {
      setLoading(true);

      // Payload limpio: Solo enviamos rol y permisos
      const payload = {
        role: role,
        permissions: role === "admin" ? [] : activePermissions,
      };

      await OrgMemberService.update(workspaceUid, memberId, payload);

      toast.success("Permisos actualizados correctamente");
    } catch (error: any) {
      toast.error(error?.message || "Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground animate-pulse flex justify-center">
        Cargando accesos del usuario...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* HEADER DE LA PÁGINA */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Accesos de {member?.user?.name || "Usuario"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona el rol y los permisos específicos de este miembro.
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>Guardar Accesos</Button>
      </div>

      {/* ÁREA DE CONTENIDO (Sin Sidebar) */}
      <div className="bg-card border rounded-lg shadow-sm p-6 md:p-8">
        <div className="space-y-8">
          
          {/* SECCIÓN: ROL DEL SISTEMA */}
          <div className="space-y-4 border-b pb-8">
            <div>
              <h3 className="text-lg font-medium">Rol del Sistema</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona el nivel de acceso principal para este usuario.
              </p>
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full md:w-[400px]">
                <SelectValue placeholder="Selecciona el rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  Member (Acceso Personalizado)
                </SelectItem>
                <SelectItem value="admin">
                  Admin (Acceso Total al Workspace)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SECCIÓN: PERMISOS ESPECÍFICOS */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Permisos Específicos</h3>
              <p className="text-sm text-muted-foreground">
                Activa o desactiva módulos para este usuario. Si el usuario es
                "Admin", todos los permisos estarán activos por defecto.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {PERMISSION_GROUPS.map((group) => (
                <div
                  key={group.category}
                  className="bg-muted/10 border rounded-lg p-5"
                >
                  <div className="flex items-center gap-2 mb-5 text-foreground font-medium pb-3 border-b">
                    {group.icon}
                    {group.category}
                  </div>
                  <div className="space-y-5">
                    {group.permissions.map((perm) => (
                      <div
                        key={perm.key}
                        className="flex items-center justify-between gap-4"
                      >
                        <label className="text-sm text-muted-foreground cursor-pointer leading-tight">
                          {perm.label}
                        </label>
                        <Switch
                          disabled={role === "admin"}
                          checked={
                            role === "admin" ||
                            activePermissions.includes(perm.key)
                          }
                          onCheckedChange={(checked) =>
                            handleTogglePermission(perm.key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}