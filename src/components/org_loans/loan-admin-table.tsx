"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoanApplication } from "@/services/org-loan/org-loan.service";

interface LoanTableProps {
  applications: LoanApplication[];
  onEdit: (application: LoanApplication) => void;
  onDelete: (uid: string) => void;
}

export function LoanTable({ applications, onEdit, onDelete }: LoanTableProps) {
  const renderStatus = (status: string) => {
    const config: Record<string, { bg: string; label: string }> = {
      pending: { bg: "bg-amber-100 text-amber-800", label: "Pendiente" },
      reviewing: { bg: "bg-blue-100 text-blue-800", label: "En Revisión" },
      approved: { bg: "bg-emerald-100 text-emerald-800", label: "Aprobado" },
      rejected: { bg: "bg-rose-100 text-rose-800", label: "Rechazado" },
      completed: { bg: "bg-slate-200 text-slate-800", label: "Finalizado" },
    };
    const current = config[status] || config.pending;
    return <Badge className={`${current.bg} border-none shadow-none`}>{current.label}</Badge>;
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed">
        <p className="text-slate-500 font-medium">No se encontraron solicitudes de préstamos.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Aplicante</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Tipo / Monto</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="text-sm font-medium text-slate-600">
                {new Date(app.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {/* Nombre desde la relación customer */}
                <div className="font-semibold text-slate-900">
                  {app.customer ? `${app.customer.first_name} ${app.customer.last_name}` : app.applicant_name}
                </div>
                {/* Estado desde la tabla org_loan_applications */}
                <div className="text-xs text-slate-500">
                  {app.applicant_state || 'Sin estado'}
                </div>
              </TableCell>
              <TableCell>
                {/* Correo y Teléfono desde la relación customer */}
                <div className="text-sm text-slate-700">
                  {app.customer?.email || app.applicant_email}
                </div>
                <div className="text-xs text-slate-500">
                  {app.customer?.phone || app.applicant_phone}
                </div>
              </TableCell>
              <TableCell>
                {/* Tipo y Monto desde la tabla org_loan_applications */}
                <div className="text-sm font-medium text-slate-900 capitalize">{app.loan_type}</div>
                <div className="text-xs text-slate-500">
                  {app.estimated_amount ? `$${Number(app.estimated_amount).toLocaleString()}` : "N/D"}
                </div>
              </TableCell>
              <TableCell>{renderStatus(app.status)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(app)} className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(app.uid)} className="text-rose-600 hover:text-rose-800 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}