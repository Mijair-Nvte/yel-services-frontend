"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function AdminPropertySheet({ open, onClose, property, users, onSave }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    user_id: "unassigned",
    portfolio_type: "",
    investment_amount: "",
    cash_flow_status: "",
    status: "prospect",
    image_path: "",
  });

  // Aseguramos que la lista sea un array siempre
  const safeUsers = Array.isArray(users) ? users : [];

  useEffect(() => {
    if (open) {
      if (property) {
        // Obtenemos el ID del dueño del objeto 'owner' o del 'user_id' directo
        const ownerId = property.owner?.id?.toString() || property.user_id?.toString() || "unassigned";
        
        setFormData({
          title: property.title || "",
          user_id: ownerId,
          portfolio_type: property.portfolio_type || "",
          investment_amount: property.investment_amount?.toString() || "",
          cash_flow_status: property.cash_flow_status || "",
          status: property.status || "prospect",
          image_path: property.image_path || "",
        });
      } else {
        // Reset a valores vacíos para nueva propiedad
        setFormData({ 
          title: "", user_id: "unassigned", portfolio_type: "", 
          investment_amount: "", cash_flow_status: "", status: "prospect", image_path: "" 
        });
      }
    }
  }, [property, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        user_id: formData.user_id === "unassigned" ? null : parseInt(formData.user_id),
        investment_amount: parseFloat(formData.investment_amount) || 0,
      };
      await onSave(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="p-3">
        <SheetHeader className="mb-6">
          <SheetTitle>{property ? "Editar Propiedad" : "Nueva Propiedad"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título / Dirección</Label>
            <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <Label>Asignar a Inversionista</Label>
            {/* El key={formData.user_id} fuerza al Select a re-renderizarse si cambia el ID */}
            <Select 
              key={formData.user_id} 
              value={formData.user_id} 
              onValueChange={(val) => setFormData({ ...formData, user_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un inversionista..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">-- Inventario (Sin Asignar) --</SelectItem>
                {safeUsers.map((u: any) => (
                  <SelectItem key={u.id.toString()} value={u.id.toString()}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Inversión ($)</Label>
              <Input type="number" required value={formData.investment_amount} onChange={(e) => setFormData({ ...formData, investment_amount: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Estatus</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospecto</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="closed">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Guardar cambios"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}