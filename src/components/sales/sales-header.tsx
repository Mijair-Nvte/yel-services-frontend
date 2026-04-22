"use client";

import { HandCoins, TrendingUp, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesHeader({ sales = [] }: { sales?: any[] }) {
  // Los cálculos se mantienen igual, pero ahora 'sales' ya vendrá filtrado desde el padre
  const totalGross = sales.reduce(
    (acc, sale) => acc + Number(sale.total_amount || 0),
    0,
  );

  const totalCommissions = sales.reduce(
    (acc, sale) => acc + Number(sale.commission_amount || 0),
    0,
  );

  const pendingAmount = sales
    .filter((s) => s.commission_status === "pending")
    .reduce((acc, sale) => acc + Number(sale.commission_amount || 0), 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className="space-y-10 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 bg-clip-text">
          Ventas y Comisiones
        </h2>
        <p className="text-base text-slate-500 max-w-2xl font-light">
          {/* Un toque dinámico para avisar que hay filtros activos */}
          Resumen consolidado de ingresos.
          <span className="text-indigo-600 font-medium ml-1">
            {sales.length} transacciones encontradas.
          </span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Tarjeta Ventas Brutas */}
        <Card className="relative overflow-hidden rounded-2xl border-indigo-100/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)]">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-50/50 blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-500/80">
              Ventas Brutas Filtradas
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {formatCurrency(totalGross)}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Monto total según filtros
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta Comisiones Totales */}
        <Card className="relative overflow-hidden rounded-2xl border-emerald-100/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)]">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-50/50 blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Comisiones Filtradas
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
              <HandCoins className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-emerald-600 tabular-nums">
              {formatCurrency(totalCommissions)}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Suma de comisiones visibles
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta Por Liquidar */}
        <Card className="relative overflow-hidden rounded-2xl border-rose-100/80 bg-rose-50/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(244,63,94,0.08)]">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-rose-100/40 blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-rose-500/80">
              Por Liquidar (Filtro)
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-200/50">
              <Clock3 className="h-5 w-5 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-rose-600 tabular-nums">
              {formatCurrency(pendingAmount)}
            </div>
            <div className="mt-2 inline-flex items-center rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase">
              Acción Pendiente
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
