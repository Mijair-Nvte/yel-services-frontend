"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrgInvitations } from "@/hooks/org_team/use-org-invitations";
import { useDepartments } from "@/hooks/departments/use-departments";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  LayoutDashboard,
  Link,
  Calendar as CalendarIcon,
  Layers,
  DollarSign,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

const PERMISSION_GROUPS = [
  {
    category: "Dashboard General",
    icon: <LayoutDashboard className="w-4 h-4" />,
    permissions: [
      { key: "view_dashboard", label: "Ver Dashboard y Estadísticas" },
    ],
  },
  {
    category: "Comunicación y Avisos",
    icon: <Mail className="w-4 h-4" />,
    permissions: [
      { key: "view_notices", label: "Ver Avisos" },
      { key: "manage_notices", label: "Gestionar (Crear/Editar) Avisos" },
    ],
  },
  {
    category: "Links de la compañía",
    icon: <Link className="w-4 h-4" />,
    permissions: [
      { key: "view_company_links", label: "Ver Links" },
      { key: "manage_company_links", label: "Gestionar (Crear/Editar) Links" },
    ],
  },
  {
    category: "Calendario y Eventos",
    icon: <CalendarIcon className="w-4 h-4" />,
    permissions: [
      { key: "view_calendar", label: "Ver Calendario de la Empresa" },
      {
        key: "manage_calendar",
        label: "Gestionar (Crear/Editar/Borrar) Eventos",
      },
    ],
  },
  {
    category: "Departamentos / Áreas",
    icon: <Layers className="w-4 h-4" />,
    permissions: [
      { key: "view_areas", label: "Ver Áreas y Departamentos" },
      { key: "manage_areas", label: "Gestionar (Crear/Editar) Áreas" },
    ],
  },
  {
    category: "Módulo de Ventas",
    icon: <DollarSign className="w-4 h-4" />,
    permissions: [
      { key: "view_sales", label: "Ver Listado de Ventas" },
      {
        key: "manage_sales",
        label: "Gestionar Comisiones y Exportar Reportes",
      },
    ],
  },
  {
    category: "GHL Payment Links",
    icon: <Link2 className="w-4 h-4" />,
    permissions: [
      { key: "view_payment_links", label: "Ver Mapeos de Pago" },
      {
        key: "manage_payment_links",
        label: "Gestionar (Crear/Editar) Mapeos de GHL",
      },
    ],
  },
  // Cuando agregues más grupos aquí, se encenderán automáticamente
];

// 🔥 Extraemos TODAS las keys dinámicamente para pre-seleccionarlas
const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap((group) =>
  group.permissions.map((perm) => perm.key),
);

export default function InviteMemberPage() {
  const router = useRouter();
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { inviteMember, loading: inviting } = useOrgInvitations(workspaceUid);
  const { departments, loading: loadingDeps } = useDepartments(workspaceUid);

  // Estados del Formulario
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [departmentId, setDepartmentId] = useState<string | null>(null);

  // 🔥 Estado de los Permisos (Por defecto, TODOS encendidos)
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
        {/* SECCIÓN 1: DATOS BÁSICOS */}
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
              <label className="text-sm font-medium">Rol del Sistema</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">
                    Miembro (Personalizado)
                  </SelectItem>
                  <SelectItem value="admin">Administrador (Total)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2 mb-5">
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

        {/* SECCIÓN 2: PERMISOS INICIALES */}
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium">Permisos Iniciales</h3>
            <p className="text-sm text-muted-foreground">
              {role === "admin"
                ? "Los administradores tienen acceso a todos los módulos de la plataforma por defecto."
                : "Activa o desactiva módulos. El usuario tendrá estos permisos al aceptar la invitación."}
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
  );
}
