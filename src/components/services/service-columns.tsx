"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { Package, Percent, DollarSign, MapPin, Copy } from "lucide-react";
import { toast } from "sonner";

interface ServiceColumnProps {
  onEdit: (service: any) => void;
  onDelete: (uid: string) => void;
}

export const getServiceColumns = ({
  onEdit,
  onDelete,
}: ServiceColumnProps): ColumnDef<any>[] => [
{
    id: "name",
    header: "Servicio",
    accessorFn: (row) =>
      `${row.name || ""} ${row.uid || ""} ${row.stripe_product_id || ""} ${row.stripe_price_id || ""}`,
    cell: ({ row }) => {
      const service = row.original;

      const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado al portapapeles`);
      };

      return (
        <div className="flex items-center gap-3 py-1">
          {service.cover_image_url ? (
            <div className="shrink-0 h-11 w-11 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
              <img
                src={service.cover_image_url}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-fuchsia-100/80 h-11 w-11 rounded-xl flex items-center justify-center text-fuchsia-600 shrink-0 border border-fuchsia-200/50">
              <Package className="h-5 w-5" />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="font-bold text-slate-900 leading-tight">
              {service.name}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span
                className="font-mono truncate max-w-[150px]"
                title={service.uid}
              >
                {service.uid}
              </span>
              <button
                onClick={() => copyToClipboard(service.uid, "Service UID")}
                className="hover:text-fuchsia-600 transition-colors"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => (
      <span className="inline-flex items-center text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
        <DollarSign className="h-3 w-3 mr-0.5" />
        {row.original.price}
      </span>
    ),
  },
  {
    id: "commission",
    header: "Comisión",
    accessorFn: (row) =>
      `${row.default_commission_type} ${row.default_commission_value}`,
    cell: ({ row }) => {
      const service = row.original;
      const isPercentage = service.default_commission_type === "percentage";
      return (
        <span className="inline-flex items-center text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
          {isPercentage ? (
            <Percent className="h-3 w-3 mr-1 text-slate-400" />
          ) : (
            <DollarSign className="h-3 w-3 mr-1 text-slate-400" />
          )}
          {parseFloat(service.default_commission_value)}
          {isPercentage ? "%" : " USD"}
        </span>
      );
    },
  },
  {
    id: "availability",
    header: "Disponibilidad",
    accessorFn: (row) => row.availability_type,
    cell: ({ row }) => {
      const service = row.original;
      if (service.availability_type === "restricted") {
        return (
          <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-100 max-w-[180px]">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span
              className="line-clamp-2 leading-tight"
              title={service.available_states?.join(", ")}
            >
              <span className="font-semibold">Restringido:</span>{" "}
              {service.available_states?.length > 0
                ? service.available_states.join(", ")
                : "Ningún estado"}
            </span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>Nacional (Todos)</span>
        </div>
      );
    },
  },
{
    id: "is_active",
    header: "Estado",
    // Convertimos a string para que el filtro de la DataTable funcione correctamente
    accessorFn: (row) => (row.is_active ? "true" : "false"),
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge
          variant="outline"
          className={
            isActive
              ? "text-emerald-600 bg-emerald-50/50 border-emerald-200 text-xs px-2 py-0.5"
              : "text-slate-500 bg-slate-100 border-slate-200 text-xs px-2 py-0.5"
          }
        >
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "stripe_ids",
    header: "Stripe IDs",
    cell: ({ row }) => {
      const service = row.original;
      const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado al portapapeles`);
      };

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
            <span
              className="truncate max-w-[110px] font-mono"
              title={service.stripe_product_id}
            >
              <span className="font-semibold mr-1">PROD:</span>
              {service.stripe_product_id}
            </span>
            <button
              onClick={() =>
                copyToClipboard(service.stripe_product_id, "Product ID")
              }
              className="hover:text-fuchsia-600 transition-colors"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
            <span
              className="truncate max-w-[110px] font-mono"
              title={service.stripe_price_id}
            >
              <span className="font-semibold mr-1">PRIC:</span>
              {service.stripe_price_id}
            </span>
            <button
              onClick={() =>
                copyToClipboard(service.stripe_price_id, "Price ID")
              }
              className="hover:text-fuchsia-600 transition-colors"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Acciones</div>,
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <DataTableRowActions
          row={row}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original.uid)}
        />
      </div>
    ),
  },
];
