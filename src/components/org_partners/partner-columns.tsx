"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";

interface PartnerColumnProps {
  onView: (partner: any) => void;
}

export const getPartnerColumns = ({ onView }: PartnerColumnProps): ColumnDef<any>[] => [
  {
    id: "user",
    header: "Usuario",
    accessorFn: (row) => {
      const legalName = row.tax_form_data?.legal_name || "";
      const name = row.user?.name || "";
      const email = row.user?.email || "";
      return `${legalName} ${name} ${email}`;
    },
    cell: ({ row }) => {
      const partner = row.original;
      const displayName = partner.tax_form_data?.legal_name || partner.user?.name;
      const email = partner.user?.email;

      return (
        <div>
          <p className="font-medium text-slate-900">{displayName}</p>
          <p className="text-muted-foreground text-xs">{email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "tax_form_type",
    header: "Formulario Fiscal",
    cell: ({ row }) => (
      <Badge variant="outline" className="uppercase font-mono text-[10px]">
        {row.original.tax_form_type || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "referral_code",
    header: "Código Referido",
    cell: ({ row }) => {
      const code = row.original.referral_code;
      return code ? (
        <code className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
          {code}
        </code>
      ) : (
        <span className="text-muted-foreground text-xs italic">N/A</span>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Estatus",
    cell: ({ row }) => {
      const status = row.original.status || "pending";
      const config: Record<string, { bg: string; label: string }> = {
        pending: { bg: "bg-amber-100 text-amber-800", label: "Pendiente" },
        approved: { bg: "bg-emerald-100 text-emerald-800", label: "Aprobado" },
        rejected: { bg: "bg-rose-100 text-rose-800", label: "Rechazado" },
      };
      const current = config[status] || config.pending;
      return <Badge className={`${current.bg} border-none shadow-none`}>{current.label}</Badge>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Acciones</div>,
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <DataTableRowActions
          row={row}
          onView={() => onView(row.original)} 
        />
      </div>
    ),
  },
];