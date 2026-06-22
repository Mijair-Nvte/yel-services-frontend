"use client";

import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Mail,
  Link as LinkIcon,
  Calendar as CalendarIcon,
  Layers,
  DollarSign,
  Link2,
  User,
  FolderCheck,
  Package,
  Clock,
} from "lucide-react";

export const PERMISSION_GROUPS = [
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
    icon: <LinkIcon className="w-4 h-4" />,
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
    category: "Folder / Documentos",
    icon: <FolderCheck className="w-4 h-4" />,
    permissions: [
      { key: "view_documents", label: "Ver folder y Documentos" },
      { key: "manage_documents", label: "Gestionar (Crear/Editar) Documentos" },
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
    category: "Servicios y Productos",
    icon: <Package className="w-4 h-4" />,
    permissions: [
      { key: "view_services", label: "Ver Servicios y Reglas de Comisión" },
      {
        key: "manage_services",
        label: "Gestionar (Crear/Editar) Servicios",
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
  {
    category: "Gestión de Usuarios y Accesos",
    icon: <User className="w-4 h-4" />,
    permissions: [
      {
        key: "view_users",
        label: "Ver Configuración de Usuarios (Roles y Accesos)",
      },
      {
        key: "manage_users",
        label: "Administrar (Invitar, Editar y Eliminar) Usuarios",
      },
    ],
  },
  {
    category: "Gestión de Time Tracking",
    icon: <Clock className="w-4 h-4" />,
    permissions: [
      {
        key: "view_time_tracking",
        label: "Ver entrada y tiempo de los usuarios",
      },
      {
        key: "manage_time_tracking",
        label: "Administrar (Tiempo) Usuarios",
      },
    ],
  },
];

// 🔥 Extraemos TODAS las keys dinámicamente para pre-seleccionarlas al invitar
export const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap((group) =>
  group.permissions.map((perm) => perm.key),
);

interface RolePermissionManagerProps {
  role: string;
  setRole: (role: string) => void;
  activePermissions: string[];
  onTogglePermission: (permKey: string, checked: boolean) => void;
  isInviteMode?: boolean; // Para cambiar sutilmente los textos si es necesario
}

export function RolePermissionManager({
  role,
  setRole,
  activePermissions,
  onTogglePermission,
  isInviteMode = false,
}: RolePermissionManagerProps) {
  return (
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
              Miembro (Acceso Personalizado)
            </SelectItem>
            <SelectItem value="admin">
              Administrador (Acceso Total al Workspace)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* SECCIÓN: PERMISOS ESPECÍFICOS */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            {isInviteMode ? "Permisos Iniciales" : "Permisos Específicos"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {role === "admin"
              ? "Los administradores tienen acceso a todos los módulos de la plataforma por defecto."
              : isInviteMode
                ? "Activa o desactiva módulos. El usuario tendrá estos permisos al aceptar la invitación."
                : "Activa o desactiva módulos de acceso para este usuario en particular."}
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
                        role === "admin" || activePermissions.includes(perm.key)
                      }
                      onCheckedChange={(checked) =>
                        onTogglePermission(perm.key, checked)
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
  );
}
