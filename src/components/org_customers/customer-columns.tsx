"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OrgCustomer } from "@/services/org-customer/org-customer.service";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { Mail, Phone } from "lucide-react";

interface CustomerColumnProps {
  onView: (customer: OrgCustomer) => void;
  onDelete: (uid: string) => void;
}

export const getCustomerColumns = ({ onView, onDelete }: CustomerColumnProps): ColumnDef<OrgCustomer>[] => [
  {
    accessorKey: "created_at",
    header: "Registro",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-slate-600">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "name",
    header: "Cliente",
    accessorFn: (row) => `${row.first_name} ${row.last_name || ""}`.trim(),
    cell: ({ row }) => {
      const customer = row.original;
      const fullName = `${customer.first_name} ${customer.last_name || ""}`.trim();
      return (
        // ✅ Envolvemos el contenido en un div cliqueable
        <div 
          className="cursor-pointer group" 
          onClick={() => onView(customer)}
        >
          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {fullName}
          </div>
    
        </div>
      );
    },
  },
  {
    id: "contact",
    header: "Contacto",
    accessorFn: (row) => `${row.email || ""} ${row.phone || ""}`,
    cell: ({ row }) => {
      const { email, phone } = row.original;
      return (
        <div className="space-y-1">
          {email ? (
            <div className="flex items-center text-sm text-slate-700 gap-2">
              <Mail className="h-3 w-3 text-slate-400" /> {email}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">Sin correo</div>
          )}
          {phone && (
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <Phone className="h-3 w-3 text-slate-400" /> {phone}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "tags",
    header: "Etiquetas",
    cell: ({ row }) => {
      const tags = row.original.metadata?.tags as string[];
      if (!tags || tags.length === 0) return <span className="text-xs text-slate-300">-</span>;
      
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Acciones</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-2">
          <DataTableRowActions
            row={row}
            onView={() => onView(row.original)}
            onDelete={() => onDelete(row.original.uid)}
          />
        </div>
      );
    },
  },
];