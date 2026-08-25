"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { InsuranceApplication } from "@/services/insurance/org-insurance.service";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";

// Interfaz para recibir las acciones desde la vista principal
interface InsuranceColumnProps {
  onEdit: (application: InsuranceApplication) => void;
  onDelete: (uid: string) => void;
}

// Exportamos una función que recibe los callbacks y retorna el arreglo de columnas
export const getInsuranceColumns = ({ onEdit, onDelete }: InsuranceColumnProps): ColumnDef<InsuranceApplication>[] => [
  {
    accessorKey: "created_at",
    header: "Fecha",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-slate-600">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "applicant",
    header: "Aplicante",
    // accessorFn le dice al buscador global en qué texto buscar (Nombre)
    accessorFn: (row) =>
      row.customer ? `${row.customer.first_name} ${row.customer.last_name}` : row.applicant_name,
    cell: ({ row }) => {
      const app = row.original;
      const name = app.customer
        ? `${app.customer.first_name} ${app.customer.last_name}`
        : app.applicant_name;
      return (
        <div>
          <div className="font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500 capitalize">{app.insurance_type || "General"}</div>
        </div>
      );
    },
  },
  {
    id: "contact",
    header: "Contacto",
    // accessorFn le dice al buscador global en qué texto buscar (Email y teléfono)
    accessorFn: (row) =>
      `${row.customer?.email || row.applicant_email} ${row.customer?.phone || row.applicant_phone}`,
    cell: ({ row }) => {
      const app = row.original;
      const email = app.customer?.email || app.applicant_email;
      const phone = app.customer?.phone || app.applicant_phone;
      return (
        <div>
          <div className="text-sm text-slate-700">{email}</div>
          <div className="text-xs text-slate-500">{phone}</div>
        </div>
      );
    },
  },
   {
    id: "Referido",
    header: "Referido",
    accessorFn: (row) => row.user?.name || "Sin asignar",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="text-sm font-medium text-slate-900">
            {user?.name || "Sin asignar"}
          </div>
          {user?.email && (
            <div className="text-xs text-slate-500">{user.email}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estatus",
    cell: ({ row }) => {
      const status = row.original.status;
      const config: Record<string, { bg: string; label: string }> = {
        pending: { bg: "bg-amber-100 text-amber-800", label: "Pendiente" },
        reviewing: { bg: "bg-blue-100 text-blue-800", label: "En Revisión" },
        approved: { bg: "bg-emerald-100 text-emerald-800", label: "Aprobado" },
        rejected: { bg: "bg-rose-100 text-rose-800", label: "Rechazado" },
        completed: { bg: "bg-slate-200 text-slate-800", label: "Finalizado" },
      };
      const current = config[status] || config.pending;
      return <Badge className={`${current.bg} border-none shadow-none`}>{current.label}</Badge>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Acciones</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-2">
          {/* Usamos el componente modular de Acciones que creaste */}
          <DataTableRowActions
            row={row}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original.uid)}
          />
        </div>
      );
    },
  },
];