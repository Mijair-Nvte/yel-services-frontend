"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OrgCustomer } from "@/services/org-customer/org-customer.service";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
// ✅ Agregamos ExternalLink y UserCheck a tus importaciones de lucide-react
import { Mail, Phone, ExternalLink, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // 🚀 NUEVA COLUMNA: Enlace al CRM (GoHighLevel)
  {
    id: "crm",
    header: () => <div className="text-center">CRM</div>,
    cell: ({ row }) => {
      const customer = row.original;
      const locationId = process.env.NEXT_PUBLIC_GHL_LOCATION_ID;

      // Usamos 'contact_id' que es la columna oficial en tu tabla de base de datos
      const ghlUrl = customer?.contact_id && locationId
        ? `https://app.ideashubai.com/v2/location/${locationId}/contacts/detail/${customer.contact_id}`
        : null;

      return (
        <div className="flex justify-center">
          {ghlUrl ? (
            <Button
              variant="outline"
              size="sm"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={(e) => {
                e.stopPropagation(); // Evita que se abra el modal/detalle del cliente al hacer clic aquí
                window.open(ghlUrl, '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver en CRM
            </Button>
          ) : (
            <Button variant="ghost" size="sm" disabled className="text-slate-400">
              <UserCheck className="h-4 w-4 mr-2" />
              Local
            </Button>
          )}
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