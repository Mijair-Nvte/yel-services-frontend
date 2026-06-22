"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StateSelector } from "@/components/ui/state-selector";
import { OrgServicesService } from "@/services/org_sales/services.service";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";

export function ServiceDialog({
  open,
  onOpenChange,
  service,
  workspaceUid,
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stripe_product_id: "",
    stripe_price_id: "",
    default_commission_type: "percentage",
    default_commission_value: "",
    availability_type: "all",
    available_states: [] as string[],
    is_active: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || "",
        stripe_product_id: service.stripe_product_id || "",
        stripe_price_id: service.stripe_price_id || "",
        default_commission_type:
          service.default_commission_type || "percentage",
        default_commission_value: service.default_commission_value || "",
        availability_type: service.availability_type || "all",
        available_states: service.available_states || [],
        is_active: service.is_active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        stripe_product_id: "",
        stripe_price_id: "",
        default_commission_type: "percentage",
        default_commission_value: "",
        availability_type: "all",
        available_states: [],
        is_active: true,
      });
    }
  }, [service, open]);

  const handleStateToggle = (stateId: string) => {
    setFormData((prev) => {
      const currentStates = prev.available_states || [];
      if (currentStates.includes(stateId)) {
        return {
          ...prev,
          available_states: currentStates.filter((s) => s !== stateId),
        };
      } else {
        return { ...prev, available_states: [...currentStates, stateId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (service) {
        await OrgServicesService.update(workspaceUid, service.uid, formData);
        toast.success("Servicio actualizado correctamente");
      } else {
        await OrgServicesService.create(workspaceUid, formData);
        toast.success("Servicio creado correctamente");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar Servicio" : "Nuevo Servicio"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre del Servicio</Label>
            <Input
              placeholder="Ej: Creación de LLC"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Descripción (Opcional)</Label>
            <Textarea
              placeholder="Breve descripción del servicio..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-900 font-medium mb-1">
              <MapPin className="h-4 w-4" />
              <h3>Disponibilidad Geográfica</h3>
            </div>
            <div className="space-y-2">
              <Label>¿Tiene restricciones este servicio?</Label>
              <Select
                value={formData.availability_type}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    availability_type: val,
                    available_states:
                      val === "all" ? [] : formData.available_states,
                  })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Disponible en todos los estados (Nacional)
                  </SelectItem>
                  <SelectItem value="restricted">
                    Bloqueado / No disponible en algunos estados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.availability_type === "restricted" && (
              <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label className="text-red-600 font-semibold">
                  Selecciona los estados donde el servicio ESTÁ BLOQUEADO:
                </Label>
                {/* AQUI IMPLEMENTAMOS EL COMPONENTE NUEVO */}
                <StateSelector
                  selectedStates={formData.available_states}
                  onChange={handleStateToggle}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stripe Product ID</Label>
              <Input
                placeholder="prod_..."
                value={formData.stripe_product_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stripe_product_id: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Stripe Price ID</Label>
              <Input
                placeholder="price_..."
                value={formData.stripe_price_id}
                onChange={(e) =>
                  setFormData({ ...formData, stripe_price_id: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="space-y-2">
              <Label>Tipo de Comisión</Label>
              <Select
                value={formData.default_commission_type}
                onValueChange={(val) =>
                  setFormData({ ...formData, default_commission_type: val })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                  <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor de Comisión</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 15"
                value={formData.default_commission_value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    default_commission_value: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? "Guardar Cambios" : "Crear Servicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
