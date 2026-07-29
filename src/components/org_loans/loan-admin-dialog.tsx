"use client";

import React, { useState, useEffect } from "react";
import { Loader2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoanApplication, UpdateLoanDto } from "@/services/org-loan/org-loan.service";

interface LoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: LoanApplication | null;
  onUpdate: (uid: string, data: UpdateLoanDto) => Promise<void>;
}

export function LoanDialog({ open, onOpenChange, application, onUpdate }: LoanDialogProps) {
  const [status, setStatus] = useState<string>("");
  const [commissionAmount, setCommissionAmount] = useState<string>("");
  const [commissionStatus, setCommissionStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setCommissionAmount(application.commission_amount ? application.commission_amount.toString() : "0");
      setCommissionStatus(application.commission_status || "not_applicable");
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsSaving(true);
    try {
      await onUpdate(application.uid, {
        status,
        commission_amount: parseFloat(commissionAmount) || 0,
        commission_status: commissionStatus as any,
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!application) return null;

  // Variables para simplificar la lectura en el JSX
  const displayName = application.customer 
    ? `${application.customer.first_name} ${application.customer.last_name}` 
    : application.applicant_name;
    
  const displayEmail = application.customer?.email || application.applicant_email;
  const displayPhone = application.customer?.phone || application.applicant_phone;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <DialogTitle>Administrar Solicitud de Préstamo</DialogTitle>
          </div>
          <DialogDescription>
            Revisa los datos de <strong>{displayName}</strong> y gestiona su estatus y comisiones.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Email:</span>
            <span className="font-medium text-slate-900">{displayEmail}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Teléfono:</span>
            <span className="font-medium text-slate-900">{displayPhone}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Tipo de Préstamo:</span>
            <span className="font-medium text-slate-900 capitalize">{application.loan_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Monto Estimado:</span>
            <span className="font-medium text-slate-900">
              {application.estimated_amount ? `$${Number(application.estimated_amount).toLocaleString()}` : "N/D"}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission_amount">Monto de Comisión ($)</Label>
              <Input
                id="commission_amount"
                type="number"
                step="0.01"
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_status">Estatus Comisión</Label>
              <Select value={commissionStatus} onValueChange={setCommissionStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Estatus comisión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_applicable">No aplica</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="paid">Pagada</SelectItem>
                </SelectContent>
              </Select>
            </div>
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