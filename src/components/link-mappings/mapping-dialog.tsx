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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LinkMappingService } from "@/services/org_sales/link-mappings.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function MappingDialog({
  open,
  onOpenChange,
  mapping,
  sellers,
  workspaceUid,
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_name: "",
    ghl_payment_link_id: "",
    seller_id: "",
    is_active: true,
  });

  useEffect(() => {
    if (mapping) {
      setFormData({
        service_name: mapping.service_name,
        ghl_payment_link_id: mapping.ghl_payment_link_id,
        seller_id: mapping.seller_id.toString(),
        is_active: mapping.is_active,
      });
    } else {
      setFormData({
        service_name: "",
        ghl_payment_link_id: "",
        seller_id: "",
        is_active: true,
      });
    }
  }, [mapping, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mapping) {
        await LinkMappingService.update(workspaceUid, mapping.uid, formData);
        toast.success("Actualizado correctamente");
      } else {
        await LinkMappingService.create(workspaceUid, formData);
        toast.success("Creado correctamente");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mapping ? "Editar Mapeo" : "Nuevo Mapeo de Enlace"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre del Servicio / Producto</Label>
            <Input
              placeholder="Ej: CREA TU LLC"
              value={formData.service_name}
              onChange={(e) =>
                setFormData({ ...formData, service_name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>ID del Link (GoHighLevel)</Label>
            <Input
              placeholder="Ej: 69cd52dcc6..."
              value={formData.ghl_payment_link_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ghl_payment_link_id: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Vendedor Asignado</Label>
            <Select
              value={formData.seller_id}
              onValueChange={(val) =>
                setFormData({ ...formData, seller_id: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un vendedor" />
              </SelectTrigger>
              <SelectContent>
                {sellers.map((s: any) => (
                  <SelectItem
                    key={s.id}
                    value={s.id.toString() || s.user_id?.toString()}
                  >
                    {s.name || s.user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mapping ? "Guardar Cambios" : "Crear Mapeo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
