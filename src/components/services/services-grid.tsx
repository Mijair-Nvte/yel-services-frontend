"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit2,
  Trash2,
  Copy,
  Package,
  Percent,
  DollarSign,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

export function ServicesGrid({ services, onEdit, onDelete }: any) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
        <p className="text-slate-400 font-medium">
          No se encontraron servicios o productos.
        </p>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="hover:bg-transparent border-slate-200">
            <TableHead className="font-semibold text-slate-700">Servicio</TableHead>
            <TableHead className="font-semibold text-slate-700">Precio</TableHead>
            <TableHead className="font-semibold text-slate-700">Comisión</TableHead>
            <TableHead className="font-semibold text-slate-700">Disponibilidad</TableHead>
            <TableHead className="font-semibold text-slate-700">Stripe IDs</TableHead>
            <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service: any) => (
            <TableRow 
              key={service.uid} 
              className="hover:bg-fuchsia-50/40 transition-colors border-slate-100 group"
            >
              {/* Servicio (Nombre y Estado) */}
              
         <TableCell>
                <div className="flex items-center gap-3">
                  {/* Contenedor de la Imagen o el Icono */}
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

                  {/* Textos */}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-900 leading-tight">
                      {service.name}
                    </span>
                    <div>
                      <Badge
                        variant="outline"
                        className={
                          service.is_active
                            ? "text-emerald-600 bg-emerald-50/50 border-emerald-200 text-[10px] px-1.5 py-0"
                            : "text-slate-500 bg-slate-100 border-slate-200 text-[10px] px-1.5 py-0"
                        }
                      >
                        {service.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Precio */}
              <TableCell>
                <span className="inline-flex items-center text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                  <DollarSign className="h-3 w-3 mr-0.5" />
                  {service.price}
                </span>
              </TableCell>

              {/* Comisión */}
              <TableCell>
                <span className="inline-flex items-center text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                  {service.default_commission_type === "percentage" ? (
                    <Percent className="h-3 w-3 mr-1 text-slate-400" />
                  ) : (
                    <DollarSign className="h-3 w-3 mr-1 text-slate-400" />
                  )}
                  {parseFloat(service.default_commission_value)}
                  {service.default_commission_type === "percentage" ? "%" : " USD"}
                </span>
              </TableCell>

              {/* Disponibilidad */}
              <TableCell>
                {service.availability_type === "restricted" ? (
                  <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-100 max-w-[180px]">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="line-clamp-2 leading-tight" title={service.available_states?.join(", ")}>
                      <span className="font-semibold">Restringido:</span>{" "}
                      {service.available_states?.length > 0
                        ? service.available_states.join(", ")
                        : "Ningún estado"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>Nacional (Todos)</span>
                  </div>
                )}
              </TableCell>

              {/* Stripe IDs */}
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                    <span className="truncate max-w-[100px] font-mono" title={service.stripe_product_id}>
                      <span className="font-semibold mr-1">PROD:</span>
                      {service.stripe_product_id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(service.stripe_product_id, "Product ID")}
                      className="hover:text-fuchsia-600 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                    <span className="truncate max-w-[100px] font-mono" title={service.stripe_price_id}>
                      <span className="font-semibold mr-1">PRIC:</span>
                      {service.stripe_price_id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(service.stripe_price_id, "Price ID")}
                      className="hover:text-fuchsia-600 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </TableCell>

              {/* Acciones */}
              <TableCell className="text-right align-middle">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50"
                    onClick={() => onEdit(service)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(service.uid)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}