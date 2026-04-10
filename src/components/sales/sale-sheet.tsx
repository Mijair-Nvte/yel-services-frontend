"use client";

import {
  HandCoins,
  FileText,
  ClipboardList,
  Calendar,
  Package,
  Percent,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SaleSheet({
  open,
  sale,
  onClose,
  onUpdateCommissionStatus,
}: any) {
  if (!sale) return null;

  const isPaid = sale.commission_status === "paid";

  // Cálculo dinámico del porcentaje de comisión (ej: 0.08 -> 8%)
  const commissionPercentage =
    sale.total_amount > 0
      ? Math.round((sale.commission_amount / sale.total_amount) * 100)
      : 0;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-0 flex flex-col bg-white">
        <div className="bg-white p-6 border-b shadow-sm">
          <SheetHeader className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant="secondary"
                className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] font-bold px-2 py-0"
              >
                GHL SYNC
              </Badge>
              <span className="text-[11px] text-slate-400 font-mono tracking-tighter">
                REF_{sale.id}
              </span>
            </div>
            <SheetTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Detalle de Operación
            </SheetTitle>
            <SheetDescription className="text-slate-500 text-sm italic">
              ID Externo: {sale.source_id}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-slate-100">
                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                  {sale.customer_name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-slate-900 leading-tight">
                  {sale.customer_name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <Calendar className="h-3 w-3" /> Registrado el{" "}
                  {new Date(sale.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Separator className="bg-slate-100" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                  Producto
                </label>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5 leading-none">
                  <Package className="h-3.5 w-3.5 text-blue-500" />{" "}
                  {sale.product_name}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                  Venta Bruta
                </label>
                <p className="text-xl font-black text-slate-900 tabular-nums leading-none">
                  ${Number(sale.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-slate-400" /> Liquidación
              </h4>
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border",
                  isPaid
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200",
                )}
              >
                <Percent className="h-3 w-3" /> {commissionPercentage}% Comisión
              </div>
            </div>

            <div
              className={cn(
                "rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500",
                isPaid
                  ? "bg-emerald-600 shadow-emerald-900/20"
                  : "bg-amber-500 shadow-amber-900/20",
              )}
            >
              <div className="absolute -right-4 -bottom-4 opacity-10">
                {isPaid ? (
                  <CheckCircle2 className="h-24 w-24" />
                ) : (
                  <HandCoins className="h-24 w-24" />
                )}
              </div>
              <div className="relative z-10 flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold opacity-70 tracking-widest">
                    Vendedor
                  </span>
                  <p className="text-lg font-bold tracking-tight">
                    {sale.seller?.name || "Sin Asignar"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold opacity-70 tracking-widest block mb-1">
                    Monto de Comisión
                  </span>
                  <p className="text-4xl font-black tabular-nums tracking-tighter leading-none">
                    ${Number(sale.commission_amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center border transition-colors",
                    isPaid
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-yellow-50 border-yellow-100",
                  )}
                >
                  {isPaid ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    Estado del Pago
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isPaid ? "Comisión liquidada" : "Pendiente de procesar"}
                  </p>
                </div>
              </div>
              <Select
                defaultValue={sale.commission_status}
                onValueChange={(val) => onUpdateCommissionStatus(sale.id, val)}
              >
                <SelectTrigger
                  className={cn(
                    "w-[140px] h-10 font-bold border-slate-200 rounded-xl",
                    isPaid ? "text-emerald-700" : "text-yellow-700",
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2 font-medium text-yellow-600">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />{" "}
                      Pendiente
                    </span>
                  </SelectItem>
                  <SelectItem value="paid">
                    <span className="flex items-center gap-2 font-medium text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                      Pagada
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>

        <div className="p-6 bg-white border-t mt-auto">
          <div className="flex justify-center items-center gap-2 text-[10px] text-slate-300 uppercase font-black tracking-[0.2em]">
            <div className="h-px w-8 bg-slate-100" /> Yel Services Admin{" "}
            <div className="h-px w-8 bg-slate-100" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
