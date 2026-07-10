"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrgUserService } from "@/services/org_settings/users/org-user.service";
import { TeamSelector } from "@/components/shared/team-selector";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

interface ServiceOrderSheetProps {
  open: boolean;
  order: any | null;
  workspaceUid: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function ServiceOrderSheet({
  open,
  order,
  workspaceUid,
  onClose,
  onSubmit,
}: ServiceOrderSheetProps) {
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    status: "pending",
    assigned_to: "",
    follower_ids: [] as string[],
  });

  // Cargar el directorio de usuarios cuando se abre el panel
  useEffect(() => {
    if (open && workspaceUid) {
      OrgUserService.getDirectory(workspaceUid)
        .then((res) => setTeamMembers(res || []))
        .catch(() =>
          toast.error("Error al sincronizar el directorio de la empresa"),
        );
    }
  }, [open, workspaceUid]);

  // Sincronizar el estado del formulario con la orden seleccionada para edición
  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        assigned_to: order.assigned_to ? String(order.assigned_to) : "",
        follower_ids: order.followers
          ? order.followers.map((f: any) => String(f.id))
          : [],
      });
    }
  }, [order, open]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Limpiamos el valor si el usuario elige dejar la orden sin asignar
    const payload = {
      status: formData.status,
      assigned_to:
        formData.assigned_to === "none" || !formData.assigned_to
          ? null
          : Number(formData.assigned_to),
      follower_ids: formData.follower_ids.map((id) => Number(id)),
    };

    try {
      await onSubmit(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="p-4">
        <div className="space-y-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Gestionar Trámite Operativo
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-400 font-mono">
              Orden ID: #{order?.uid?.toLowerCase() || "Nueva"}
            </SheetDescription>
          </SheetHeader>

          {/* Información del Contexto de Compra */}
          {order && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <p>
                <span className="text-slate-400 font-medium">Servicio:</span>{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {order.service?.name}
                </strong>
              </p>
              <p>
                <span className="text-slate-400 font-medium">Cliente:</span>{" "}
                {order.customer?.first_name} {order.customer?.last_name} (
                {order.customer?.email})
              </p>
            </div>
          )}

          <form
            id="order-management-form"
            onSubmit={handleFormSubmit}
            className="space-y-6"
          >
            {/* Control del Pipeline (Estatus) */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                Estado del Pipeline
              </Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className="bg-white border-slate-200 h-11">
                  <SelectValue placeholder="Cambiar estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    Pendiente (Por iniciar)
                  </SelectItem>
                  <SelectItem value="in_progress">
                    En Proceso (Ejecución)
                  </SelectItem>
                  <SelectItem value="waiting_client">
                    Esperando documentación del Cliente
                  </SelectItem>
                  <SelectItem value="review">En Revisión Interna</SelectItem>
                  <SelectItem value="completed">
                    Completado e Integrado
                  </SelectItem>
                  <SelectItem value="cancelled">
                    Cancelado / Devolución
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reasignación del Responsable Principal (Owner de la Orden) */}
            <TeamSelector
              label="Responsable del Trámite (Owner)"
              placeholder="Asignar un gestor principal..."
              members={teamMembers}
              multiple={false}
              value={formData.assigned_to}
              onChange={(val) =>
                setFormData({ ...formData, assigned_to: val || "" })
              }
            />

            {/* Ajuste de Miembros de Apoyo (Followers de la Orden) */}
            <TeamSelector
              label="Involucrados y Seguimiento (Followers)"
              placeholder="Añadir colaboradores a la orden..."
              members={teamMembers}
              multiple={true}
              value={formData.follower_ids}
              onChange={(val) =>
                setFormData({ ...formData, follower_ids: val || [] })
              }
            />
          </form>
        </div>

        <SheetFooter >
          <Button
            type="submit"
            form="order-management-form"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios de Operación
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
