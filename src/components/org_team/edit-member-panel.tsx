"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Phone, Mail } from "lucide-react";

// Agrupamos los permisos del Seeder de Laravel para la vista
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

interface EditMemberPanelProps {
  isOpen: boolean;
  onClose: () => void;
  member: any; // Pasaremos el miembro seleccionado desde la tabla
  workspaceUid: string;
}

export function EditMemberPanel({
  isOpen,
  onClose,
  member,
  workspaceUid,
}: EditMemberPanelProps) {
  const [activeTab, setActiveTab] = useState<"info" | "permissions">("info");

  // Estados del formulario (Visuales de momento)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "user",
  });
  const [activePermissions, setActivePermissions] = useState<string[]>([]);

  // Cuando se abre el modal y recibe al miembro, llenamos los datos
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.user?.name || "",
        phone: member.user?.phone || "", // Asumiendo que agregaremos teléfono pronto
        role: member.role || "user",
      });
      // Aquí en el futuro setearemos los permisos reales que vengan de Spatie
      // setActivePermissions(member.spatie_data?.active_permissions || []);
    }
  }, [member]);

  const handleTogglePermission = (permKey: string, checked: boolean) => {
    if (checked) {
      setActivePermissions((prev) => [...prev, permKey]);
    } else {
      setActivePermissions((prev) => prev.filter((p) => p !== permKey));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0 overflow-hidden bg-background h-[85vh] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl">
            Editar Usuario: {member?.user?.name}
          </DialogTitle>
        </DialogHeader>

        {/* Layout estilo GoHighLevel (Sidebar izq, Contenido der) */}
        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR IZQUIERDO */}
          <div className="w-64 border-r bg-muted/10 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm transition-colors ${
                activeTab === "info"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Información del Usuario
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm transition-colors ${
                activeTab === "permissions"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Roles y Permisos
            </button>
          </div>

          {/* ÁREA DE CONTENIDO */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "info" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-lg font-medium">Datos Generales</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Actualiza la información personal de este usuario.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nombre Completo
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ej. Ahtziri Barrientos"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Correo Electrónico
                      </label>
                      <Input
                        value={member?.user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        El correo no se puede cambiar por seguridad.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Teléfono</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+52 123 456 7890"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "permissions" && (
              <div className="space-y-8 max-w-2xl">
                {/* SECCIÓN ROL BASE */}
                <div className="space-y-4 border-b pb-6">
                  <div>
                    <h3 className="text-lg font-medium">Rol del Sistema</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecciona el nivel de acceso principal.
                    </p>
                  </div>
                  <Select
                    value={formData.role}
                    onValueChange={(val) =>
                      setFormData({ ...formData, role: val })
                    }
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Selecciona el rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        User (Acceso Limitado)
                      </SelectItem>
                      <SelectItem value="admin">
                        Admin (Acceso Total al Workspace)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* MATRIZ DE PERMISOS */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">
                      Permisos Específicos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Activa o desactiva módulos para este usuario (Los Admins
                      tienen todo activo por defecto).
                    </p>
                  </div>

                  {PERMISSION_GROUPS.map((group) => (
                    <div
                      key={group.category}
                      className="bg-muted/30 border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-4 text-foreground font-medium">
                        {group.icon}
                        {group.category}
                      </div>
                      <div className="space-y-4 pl-6">
                        {group.permissions.map((perm) => (
                          <div
                            key={perm.key}
                            className="flex items-center justify-between"
                          >
                            <label className="text-sm text-muted-foreground cursor-pointer select-none">
                              {perm.label}
                            </label>
                            <Switch
                              disabled={formData.role === "admin"} // Si es admin, no dejamos tocar porque tiene todo
                              checked={
                                formData.role === "admin" ||
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
            )}
          </div>
        </div>

        {/* FOOTER - BOTONES DE ACCIÓN */}
        <div className="p-4 border-t bg-muted/20 flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => console.log("Guardar:", formData, activePermissions)}
          >
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
