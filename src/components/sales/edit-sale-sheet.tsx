"use client";

import React, { useState, useEffect } from "react";
import { Save, User, Mail, Phone, Package, DollarSign, UserCheck, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OrgCompanyService } from "@/services/org_company/org-company.service";

export function EditSaleSheet({
  open,
  sale,
  onClose,
  onEditSaleDetails,
  workspaceUid,
}: any) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const [editForm, setEditForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    product_name: "",
    total_amount: 0,
    seller_id: "none",
  });

  // Cargar los miembros del equipo cuando se abre el sheet
  useEffect(() => {
    if (open && workspaceUid) {
      setIsLoadingTeam(true);
      OrgCompanyService.team(workspaceUid)
        .then((res: any) => {
          // Tu API puede devolver el array directo o dentro de res.data
          const teamData = res.data || res;
          setTeamMembers(Array.isArray(teamData) ? teamData : []);
        })
        .catch((err) => console.error("Error al cargar equipo:", err))
        .finally(() => setIsLoadingTeam(false));
    }
  }, [open, workspaceUid]);

  useEffect(() => {
    if (open && sale) {
      setEditForm({
        customer_name: sale.customer_name || "",
        customer_email: sale.customer_email || "",
        customer_phone: sale.customer_phone || "",
        product_name: sale.product_name || "",
        total_amount: Number(sale.total_amount) || 0,
        seller_id: sale.seller?.id ? String(sale.seller.id) : "none",
      });
    }
  }, [open, sale]);

  if (!sale) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...editForm,
        seller_id: editForm.seller_id === "none" ? null : Number(editForm.seller_id),
      };

      await onEditSaleDetails(sale.id, payload);
      onClose();
    } catch (error) {
      console.error("Error guardando detalles:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-0 flex flex-col bg-white shadow-2xl">
        <SheetHeader className="space-y-1 border-b p-6 pb-4 bg-slate-50/50">
          <SheetTitle className="text-xl">Editar Detalles de Venta</SheetTitle>
          <SheetDescription className="text-slate-500 text-xs font-medium">
            REF_{sale.id} • Modifica la información general del registro.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-6 flex-1">
          {/* SECCIÓN CLIENTE */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Información del Cliente</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Nombre</label>
              <input 
                type="text" 
                className="w-full text-sm text-slate-900 border rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                value={editForm.customer_name} 
                onChange={e => setEditForm({...editForm, customer_name: e.target.value})} 
                placeholder="Nombre completo" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Correo Electrónico</label>
              <input 
                type="email" 
                className="w-full text-sm text-slate-900 border rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                value={editForm.customer_email} 
                onChange={e => setEditForm({...editForm, customer_email: e.target.value})} 
                placeholder="correo@ejemplo.com" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Teléfono</label>
              <input 
                type="text" 
                className="w-full text-sm text-slate-900 border rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                value={editForm.customer_phone} 
                onChange={e => setEditForm({...editForm, customer_phone: e.target.value})} 
                placeholder="+1 234 567 8900" 
              />
            </div>
          </div>

          {/* SECCIÓN SERVICIO Y ASIGNACIÓN */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Detalles del Servicio</h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Producto / Servicio</label>
              <input 
                type="text" 
                className="w-full text-sm text-slate-900 border rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                value={editForm.product_name} 
                onChange={e => setEditForm({...editForm, product_name: e.target.value})} 
                placeholder="Nombre del servicio" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Monto Cobrado (Bruto)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                <input 
                  type="number" 
                  className="w-full text-sm font-bold text-slate-900 border rounded-lg pl-7 pr-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                  value={editForm.total_amount} 
                  onChange={e => setEditForm({...editForm, total_amount: parseFloat(e.target.value) || 0})} 
                />
              </div>
            </div>

            {/* SELECCIÓN DE VENDEDOR - CORREGIDO PARA TU JSON */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-indigo-500" /> Asignar Vendedor
              </label>
              
              {isLoadingTeam ? (
                <div className="h-10 border rounded-lg bg-slate-50 flex items-center px-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Cargando equipo...
                </div>
              ) : (
                <Select 
                  value={editForm.seller_id} 
                  onValueChange={(val) => setEditForm({...editForm, seller_id: val})}
                >
                  <SelectTrigger className="w-full h-10 bg-slate-50 focus:bg-white focus:ring-indigo-500">
                    <SelectValue placeholder="Selecciona un vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-slate-500 italic">
                      Sin asignar
                    </SelectItem>
                    
                    {/* Aquí iteramos sobre teamMembers pero accedemos a member.user */}
                    {teamMembers.map((member: any) => {
                      const u = member.user; // <-- Extraemos el objeto user anidado
                      if (!u) return null; // Previene errores si por alguna razón viene vacío

                      return (
                        <SelectItem key={member.id} value={String(u.id)}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{u.name}</span>
                            <span className="text-xs text-slate-400">({u.email})</span>
                          </div>
                        </SelectItem>
                      );
                    })}

                  </SelectContent>
                </Select>
              )}
            </div>

          </div>
        </div>

        <SheetFooter className="">
          <Button onClick={handleSave} disabled={isSaving} >
            {isSaving ? "Guardando..." : <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold">
              Cancelar
            </Button>
          </SheetClose>
          
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}