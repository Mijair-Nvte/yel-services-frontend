"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LoanApplication } from "@/services/org-loan/org-loan.service";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";

// Interfaz para recibir las acciones desde la vista principal
interface LoanColumnProps {
  onEdit: (application: LoanApplication) => void;
  onDelete: (uid: string) => void;
}

// Exportamos una función que recibe los callbacks y retorna el arreglo de columnas
export const getLoanColumns = ({ onEdit, onDelete }: LoanColumnProps): ColumnDef<LoanApplication>[] => [
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
          <div className="text-xs text-slate-500">{app.applicant_state || "Sin estado"}</div>
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
    id: "loan_type_amount",
    header: "Tipo",
    // accessorFn nos permite buscar por el tipo de préstamo
    accessorFn: (row) => row.loan_type,
    cell: ({ row }) => {
      const app = row.original;
      return (
        <div>
          <div className="text-sm font-medium text-slate-900 capitalize">{app.loan_type}</div>

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
        Open: { bg: "bg-blue-100 text-blue-800", label: "Open" },
        Lost: { bg: "bg-rose-100 text-rose-800", label: "Lost" },
        Won: { bg: "bg-emerald-100 text-emerald-800", label: "Won" },
        Abandon: { bg: "bg-slate-200 text-slate-800", label: "Abandon" },
      };
      const current = config[status] || config.Open;
      return <Badge className={`${current.bg} border-none shadow-none`}>{current.label}</Badge>;
    },
  },
  {
    accessorKey: "won_at",
    header: "Fecha Cierre",
    cell: ({ row }) => {
      const wonAt = row.original.won_at;
      
      // Si no hay fecha (es null porque no es Won), no mostramos nada (o un pequeño guion)
      if (!wonAt) {
        return <span className="text-sm text-slate-300">-</span>;
      }

      // Si hay fecha, la formateamos bien bonita
      return (
        <span className="text-sm font-medium text-emerald-600">
          {new Date(wonAt).toLocaleDateString('es-MX', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "commission_amount",
    header: "Comisión",
    cell: ({ row }) => {
      const amount = Number(row.original.commission_amount) || 0;
      return (
        <span className="text-sm font-medium text-slate-700">
          ${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: "commission_status",
    header: "Pago",
    cell: ({ row }) => {
      const status = row.original.commission_status;
      const config: Record<string, { bg: string; label: string }> = {
        pending: { bg: "bg-amber-100 text-amber-800", label: "Pendiente" },
        paid: { bg: "bg-emerald-100 text-emerald-800", label: "Pagada" },
        not_applicable: { bg: "bg-slate-100 text-slate-500", label: "N/A" },
      };
      const current = status ? config[status] : config.not_applicable;
      return <Badge className={`${current.bg} border-none shadow-none`}>{current.label}</Badge>;
    },
  },
  {
    accessorKey: "seller_payout_date",
    header: "Fecha Pago",
    cell: ({ row }) => {
      const payoutDate = row.original.seller_payout_date;
      if (!payoutDate) return <span className="text-sm text-slate-300">-</span>;
      return (
        <span className="text-sm font-medium text-purple-600">
          {new Date(payoutDate).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Acciones</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-2">
          {/* Usamos el componente modular de Acciones que me compartiste */}
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