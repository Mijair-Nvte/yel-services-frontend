"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsuranceApplication } from "@/services/insurance/org-insurance.service";
interface InsuranceAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: InsuranceApplication | null;
  onUpdate: (uid: string, data: { status: string }) => Promise<void>;
}

export function InsuranceAdminDialog({ open, onOpenChange, application, onUpdate }: InsuranceAdminDialogProps) {
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (application) {
      setStatus(application.status);
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsSaving(true);
    try {
      await onUpdate(application.uid, { status });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" />
            <DialogTitle>Administrar Solicitud</DialogTitle>
          </div>
          <DialogDescription>
            Revisa los datos de <strong>{application.applicant_name}</strong> y actualiza el estatus del trámite.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Email:</span>
            <span className="font-medium text-slate-900">{application.applicant_email}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Teléfono:</span>
            <span className="font-medium text-slate-900">{application.applicant_phone}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Tipo de Seguro:</span>
            <span className="font-medium text-slate-900 capitalize">{application.insurance_type || "General"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Dirección:</span>
            <span className="font-medium text-slate-900 text-right w-2/3 truncate" title={application.applicant_address}>
              {application.applicant_address}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estatus de la Solicitud</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="reviewing">En Revisión</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="rejected">Rechazado</SelectItem>
                <SelectItem value="completed">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}