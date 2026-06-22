"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  Trash2,
  Copy,
  Package,
  Tag,
  Percent,
  DollarSign,
  MapPin, // 1. Importamos el icono
} from "lucide-react";
import { toast } from "sonner";

export function ServicesGrid({ services, onEdit, onDelete }: any) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {services.map((service: any) => (
        <div
          key={service.uid}
          className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all relative group flex flex-col justify-between"
        >
          <div>
            {/* Header de la tarjeta */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight line-clamp-1">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={
                        service.is_active
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-slate-400 bg-slate-50"
                      }
                    >
                      {service.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                      {service.default_commission_type === "percentage" ? (
                        <Percent className="h-3 w-3 mr-1" />
                      ) : (
                        <DollarSign className="h-3 w-3 mr-1" />
                      )}
                      {parseFloat(service.default_commission_value)}{" "}
                      {service.default_commission_type === "percentage"
                        ? "%"
                        : "USD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
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
            </div>

            {/* 2. SECCIÓN NUEVA: Indicador de Disponibilidad Geográfica */}
            <div className="mb-4">
              {service.availability_type === "restricted" ? (
                <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-100">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span className="line-clamp-2" title={service.available_states?.join(", ")}>
                    <span className="font-semibold">Restringido a:</span>{" "}
                    {service.available_states?.length > 0 
                      ? service.available_states.join(", ") 
                      : "Ningún estado seleccionado"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>Disponible en todos los estados</span>
                </div>
              )}
            </div>
          </div>

          {/* Detalles de Stripe */}
          <div className="space-y-2 mt-auto bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between group/item">
              <div className="flex items-center gap-2 overflow-hidden text-xs text-slate-500">
                <Tag className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  Product:{" "}
                  <span className="font-mono text-slate-700">
                    {service.stripe_product_id}
                  </span>
                </span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(service.stripe_product_id, "Product ID")
                }
                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center justify-between group/item">
              <div className="flex items-center gap-2 overflow-hidden text-xs text-slate-500">
                <DollarSign className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  Price:{" "}
                  <span className="font-mono text-slate-700">
                    {service.stripe_price_id}
                  </span>
                </span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(service.stripe_price_id, "Price ID")
                }
                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}