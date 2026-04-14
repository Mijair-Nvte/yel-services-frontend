"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  HandCoins,
  ClipboardList,
  Calendar as CalendarIcon,
  Package,
  CheckCircle2,
  Clock,
  Save,
  Mail,
  Phone,
  Check,
  Copy,
  UserCheck,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function SaleSheet({
  open,
  sale,
  onClose,
  onUpdateCommissionStatus,
}: any) {
  // --- ESTADOS LOCALES (FORMULARIO) ---
  const [payoutDate, setPayoutDate] = React.useState<Date | undefined>(
    undefined,
  );

  type CommissionStatus = "pending" | "paid" | "not_applicable";

  const [commPercent, setCommPercent] = React.useState(0);
  const [status, setStatus] = React.useState<CommissionStatus>("pending");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (open && sale) {
      setStatus(sale.commission_status);
      const initialPercent =
        sale.total_amount > 0
          ? (sale.commission_amount / sale.total_amount) * 100
          : 0;
      setCommPercent(Number(initialPercent.toFixed(2)));

      if (sale.seller_payout_date) {
        setPayoutDate(
          new Date(sale.seller_payout_date.split("T")[0] + "T12:00:00"),
        );
      } else {
        setPayoutDate(undefined);
      }
    }
  }, [open, sale]);

  if (!sale) return null;

  // --- MANEJADORES DE CAMBIO LOCAL ---
  const handleStatusChange = (newVal: CommissionStatus) => {
    setStatus(newVal);
    if (newVal === "paid" && !payoutDate) {
      setPayoutDate(new Date());
    }
  };

  // --- FUNCIÓN PARA GUARDAR (EL BOTÓN) ---
  const handleConfirmChanges = async () => {
    setIsSaving(true);
    const calculatedAmount = (commPercent / 100) * sale.total_amount;

    // Llamamos a la función del padre (Page.tsx)
    await onUpdateCommissionStatus(
      sale.id,
      status,
      payoutDate,
      calculatedAmount,
    );

    setIsSaving(false);
    onClose(); // Cerramos el sheet tras guardar
  };

  const statusStyles: Record<CommissionStatus | "default", string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    paid: "bg-green-100 text-green-700 border-green-200",
    not_applicable: "bg-slate-100 text-slate-700 border-slate-200",
    default: "bg-white border-slate-200 text-slate-900",
  };

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
        title="Copiar"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    );
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-0 flex flex-col bg-white border-l shadow-2xl">
        <SheetHeader className="space-y-1 border-b">
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="secondary"
              className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px]  px-2 py-0"
            >
              GHL SYNC
            </Badge>
            <span className="text-[11px] text-slate-400 font-mono tracking-tighter">
              REF_{sale.id}
            </span>
          </div>
          <SheetTitle className="text-xl  ">Detalle de Operación</SheetTitle>
          <SheetDescription className="text-slate-500 text-xs font-medium ">
            <div className="flex  gap-4">
              <div>ID Externo: {sale.source_id}</div>
              <div>Origen: {sale.source_type}</div>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="p-3 space-y-6 flex-1 bg-white">
          {/* INFO CLIENTE */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 border-2 border-white shadow-lg ring-1 ring-slate-100">
                <AvatarFallback className="bg-slate-900 text-white text-lg font-bold">
                  {sale.customer_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                  {sale.customer_name}
                </h4>

                {/* Email Row */}
                <div className="flex items-center gap-2 group">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate max-w-[180px]">
                      {sale.customer_email}
                    </span>
                  </div>
                  <CopyButton text={sale.customer_email} />
                </div>

                {/* Phone Row */}
                <div className="flex items-center gap-2 group">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sale.customer_phone}</span>
                  </div>
                  <CopyButton text={sale.customer_phone} />
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                    <CalendarIcon className="h-3 w-3" />
                    Venta: {new Date(sale.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {sale.seller && (
              <div className="mt-2 pt-3 border-t border-dashed border-slate-200">
                <div className="flex items-center justify-between bg-slate-50/80 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                        Vendedor
                      </p>
                      <p className="text-xs font-semibold text-slate-700">
                        {sale.seller.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 italic">
                      {sale.seller.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Separator className="bg-slate-100" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-green-700 block">
                  Producto
                </p>
                <p className="font-bold text-slate-700 text-xs leading-tight">
                  <Package className="h-3 w-3 inline mr-1 text-blue-500" />
                  {sale.product_name}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <label className="text-xs   block">Total</label>
                <p className="text-xl font-black text-green-700">
                  ${Number(sale.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {/* CALCULADORA DE COMISIÓN */}
          <section className="space-y-4">
            <div
              className={cn(
                "rounded-xl p-6 text-white  relative overflow-hidden transition-all duration-500",
                status === "paid"
                  ? "bg-emerald-600 shadow-emerald-900/20"
                  : "bg-amber-400 shadow-slate-900/20",
              )}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className=" uppercase font-bold">
                      Porcentaje de Comisión
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={commPercent}
                        onChange={(e) =>
                          setCommPercent(parseFloat(e.target.value) || 0)
                        }
                        className="bg-white/40  border text-black text-3xl font-bold w-20 focus:outline-none focus:border-white transition-all tabular-nums rounded px-1"
                      />
                      <span className="text-2xl font-bold ">%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs block mb-1">Monto en USD</span>
                    <p className="text-3xl font-bold tabular-nums tracking-tighter">
                      ${((commPercent / 100) * sale.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SELECTOR DE STATUS Y FECHA */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4 ">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold  uppercase ">
                  Estado de pago:
                </span>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger
                    className={` h-9 text-xs font-medium border rounded-md transition-colors ${statusStyles[status] || statusStyles.default}`}
                  >
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl">
                    <SelectItem value="pending">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />{" "}
                        Pendiente
                      </span>
                    </SelectItem>

                    <SelectItem value="paid">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />{" "}
                        Pagada
                      </span>
                    </SelectItem>

                    <SelectItem value="not_applicable">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />{" "}
                        No Aplica
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-slate-200/50" />

              <div className="space-y-2">
                <span className="text-xs  block ml-1">Fecha Programada</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-bold h-11  border-slate-200 bg-white",
                        !payoutDate && "text-slate-400",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                      {payoutDate
                        ? format(payoutDate, "PPP", { locale: es })
                        : "Asignar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 rounded-2xl border-none shadow-2xl"
                    align="center"
                  >
                    <Calendar
                      mode="single"
                      selected={payoutDate}
                      onSelect={setPayoutDate}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </section>
        </div>

        <SheetFooter>
          <Button onClick={handleConfirmChanges} disabled={isSaving}>
            {isSaving ? (
              "Guardando..."
            ) : (
              <>
                <Save className="h-5 w-5" /> Confirmar Cambios
              </>
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose}>
              Descartar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
