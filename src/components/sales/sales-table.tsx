"use client";

import {
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  CircleAlert,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formatMoney = (amount: number) => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(safeAmount);
};

export function SalesTable({
  sales,
  onViewDetail,
}: {
  sales: any[];
  onViewDetail: (s: any) => void;
}) {
  const getLocalDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const cleanDate = dateStr.split("T")[0];
    return new Date(cleanDate + "T12:00:00");
  };

  const renderStatus = (sale: any) => {
    const status = sale.commission_status;
    const payoutDate = getLocalDate(sale.seller_payout_date);

    if (status === "paid") {
      return (
        <div className="flex flex-col items-start gap-1">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50 shadow-none font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Pagada
          </Badge>
          {payoutDate && (
            <span className="text-[10px] text-slate-400 font-medium tracking-tight ml-0.5">
              {payoutDate.toLocaleDateString("es-MX", { day: '2-digit', month: 'short',year: 'numeric'  })}
            </span>
          )}
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="flex flex-col items-start gap-1">
          <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/50 shadow-none font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
          {payoutDate && (
            <span className="text-[10px] text-indigo-500 font-semibold ml-0.5 flex items-center gap-1">
              Pagar el: {payoutDate.toLocaleDateString("es-MX", { day: '2-digit', month: 'short',year: 'numeric' })}
            </span>
          )}
        </div>
      );
    }

    return (
      <Badge className="bg-slate-50 text-slate-400 border-slate-100 shadow-none font-medium px-2 py-0.5 rounded-md">
        N/A
      </Badge>
    );
  };

  return (
    <div className="relative rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-transparent">
            <TableHead className="py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Fecha</TableHead>
            <TableHead className="py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Cliente / Servicio</TableHead>
            <TableHead className="py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Monto Bruto</TableHead>
            <TableHead className="py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Vendedor</TableHead>
            <TableHead className="py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Comisión</TableHead>
            <TableHead className="py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Estatus</TableHead>
            <TableHead className="py-4 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20 text-slate-400 font-light italic">
                No hay ventas registradas.
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => {
              const commissionVal = parseFloat(sale.commission_amount) || 0;

              return (
                <TableRow
                  key={sale.id}
                  // QUITAMOS LA LÓGICA DE OPACIDAD: Ahora todas las filas se ven activas
                  className="group transition-all hover:bg-indigo-50/30 border-b border-slate-50"
                >
                  {/* FECHA */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">
                        {new Date(sale.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                        {new Date(sale.created_at).getFullYear()}
                      </span>
                    </div>
                  </TableCell>

                  {/* CLIENTE */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                        {sale.customer_name || "Cliente Final"}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1 max-w-[150px]">
                        {sale.product_name}
                      </span>
                    </div>
                  </TableCell>

                  {/* MONTO BRUTO */}
                  <TableCell className="py-4">
                    <span className="font-bold text-slate-900 text-[15px]">
                      {formatMoney(parseFloat(sale.total_amount) || 0)}
                    </span>
                  </TableCell>

                  {/* VENDEDOR */}
                  <TableCell className="py-4">
                    {sale.seller ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold border border-indigo-200/50">
                          {sale.seller.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {sale.seller.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-2 py-1 rounded-md w-fit border border-rose-100">
                        <CircleAlert className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Sin Asignar</span>
                      </div>
                    )}
                  </TableCell>

                  {/* COMISIÓN */}
                  <TableCell className="py-4">
                    {commissionVal <= 0 ? (
                      <span className="text-slate-400 text-sm font-medium">$0.00</span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        {formatMoney(commissionVal)}
                      </span>
                    )}
                  </TableCell>

                  {/* ESTATUS */}
                  <TableCell className="py-4">{renderStatus(sale)}</TableCell>

                  {/* ACCIÓN */}
                  <TableCell className="py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(sale)}
                      // QUITAMOS EL DISABLED: Ahora todos los botones funcionan
                      className="h-9 w-9 rounded-full p-0 hover:bg-slate-900 hover:text-white transition-all border border-slate-100 shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}