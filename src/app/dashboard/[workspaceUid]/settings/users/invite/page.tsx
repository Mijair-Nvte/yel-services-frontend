"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrgInvitations } from "@/hooks/org_team/use-org-invitations";
import { useDepartments } from "@/hooks/departments/use-departments";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// 🔥 Importamos el componente modular
import {
  RolePermissionManager,
  ALL_PERMISSION_KEYS,
} from "@/components/org_settings/users/role-permission-manager";

export default function InviteMemberPage() {
  const router = useRouter();
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { inviteMember, loading: inviting } = useOrgInvitations(workspaceUid);
  const { departments, loading: loadingDeps } = useDepartments(workspaceUid);

  // Estados del Formulario
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [departmentId, setDepartmentId] = useState<string | null>(null);

  // Estado de los Permisos (Por defecto, TODOS encendidos al invitar)
  const [activePermissions, setActivePermissions] =
    useState<string[]>(ALL_PERMISSION_KEYS);

  const handleTogglePermission = (permKey: string, checked: boolean) => {
    if (checked) {
      setActivePermissions((prev) => [...prev, permKey]);
    } else {
      setActivePermissions((prev) => prev.filter((p) => p !== permKey));
    }
  };

  const handleSendInvitation = async () => {
    if (!email) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }

    try {
      // Si es admin, mandamos el array vacío porque no necesita permisos extra
      const finalPermissions = role === "admin" ? [] : activePermissions;

      await inviteMember(email, role, departmentId, finalPermissions);

      toast.success("Invitación enviada correctamente");
      router.push(`/dashboard/${workspaceUid}/settings`);
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al invitar al usuario");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invitar Nuevo Miembro
            </h1>
            <p className="text-sm text-muted-foreground">
              Configura el rol y los accesos antes de enviar la invitación.
            </p>
          </div>
        </div>
        <Button onClick={handleSendInvitation} disabled={inviting}>
          {inviting ? "Enviando..." : "Enviar Invitación"}
        </Button>
      </div>

      <div className="bg-card border rounded-lg shadow-sm p-6 md:p-8 space-y-8">
        {/* SECCIÓN 1: DATOS BÁSICOS DE LA INVITACIÓN */}
        <div className="space-y-4 pb-8 border-b">
          <h3 className="text-lg font-medium">Información de la Invitación</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Correo Electrónico</label>
              <Input
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Área / Departamento (Opcional)
              </label>
              <Select
                value={departmentId ?? ""}
                onValueChange={(val) => setDepartmentId(val)}
                disabled={loadingDeps}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Asignar a un departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dep) => (
                    <SelectItem key={dep.id} value={String(dep.id)}>
                      {dep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2 Y 3: COMPONENTE MODULAR (Trae el Rol y los Permisos) */}
        <RolePermissionManager
          role={role}
          setRole={setRole}
          activePermissions={activePermissions}
          onTogglePermission={handleTogglePermission}
          isInviteMode={true}
        />
      </div>
    </div>
  );
}