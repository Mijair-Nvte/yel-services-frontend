"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrgUserService } from "@/services/org_settings/users/org-user.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// 🔥 Importamos el componente modular
import { RolePermissionManager } from "@/components/org_settings/users/role-permission-manager";

export default function EditMemberPage() {
  const router = useRouter();
  
  // ✅ CORREGIDO: Cambiamos memberId por userId para que coincida con el nombre de la carpeta [userId]
  const { workspaceUid, userId } = useParams<{
    workspaceUid: string;
    userId: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);

  const [role, setRole] = useState<string>("member");
  const [activePermissions, setActivePermissions] = useState<string[]>([]);

  useEffect(() => {
    loadMember();
    // ✅ Actualizado en las dependencias
  }, [workspaceUid, userId]);

  const loadMember = async () => {
    try {
      setLoading(true);
      // ✅ Pasamos userId al servicio
      const data = await OrgUserService.getOne(workspaceUid, userId);
      
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
    // ✅ Actualizado
    if (!workspaceUid || !userId) return;
    
    try {
      setLoading(true);
      const payload = {
        role: role,
        permissions: role === "admin" ? [] : activePermissions,
      };
      
      // ✅ Pasamos userId al servicio
      await OrgUserService.update(workspaceUid, userId, payload);
      
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
      {/* HEADER */}
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
        <Button onClick={handleSave} disabled={loading}>
          Guardar Accesos
        </Button>
      </div>

      <div className="bg-card border rounded-lg shadow-sm p-6 md:p-8">
        {/* COMPONENTE MODULAR DE PERMISOS */}
        <RolePermissionManager
          role={role}
          setRole={setRole}
          activePermissions={activePermissions}
          onTogglePermission={handleTogglePermission}
          isInviteMode={false}
        />
      </div>
    </div>
  );
}