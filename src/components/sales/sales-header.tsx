"use client";

import { HandCoins, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesHeader({ sales = [] }: { sales?: any[] }) {
  const comissionableSales = sales.filter((s) => s.source_type === "payment_link");
  
  const totalGross = comissionableSales.reduce((acc, sale) => acc + Number(sale.total_amount || 0), 0);
  const totalCommissions = comissionableSales.reduce((acc, sale) => acc + Number(sale.commission_amount || 0), 0);
  const pendingAmount = comissionableSales
    .filter((s) => s.commission_status === "pending")
    .reduce((acc, sale) => acc + Number(sale.commission_amount || 0), 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 border-b pb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Ventas y Comisiones
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl">
          Sincronización automatizada vía webhook de transacciones de Go High Level.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Tarjeta Ventas Brutas */}
        <Card className="rounded-xl border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Ventas Brutas Comisionables
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {formatCurrency(totalGross)}
            </div>
            <p className="text-xs text-slate-400 mt-2">Ingreso generado por links de pago</p>
          </CardContent>
        </Card>

        {/* Tarjeta Comisiones */}
        <Card className="rounded-xl border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Comisión Generada (8%)
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <HandCoins className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-600 tabular-nums">
              {formatCurrency(totalCommissions)}
            </div>
            <p className="text-xs text-slate-400 mt-2">Histórico de comisiones a vendedores</p>
          </CardContent>
        </Card>

        {/* Tarjeta Pendientes */}
        <Card className="rounded-xl border-amber-200/60 bg-amber-50/30 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">
              Pendiente de Liquidar
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-amber-700 tabular-nums">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-xs text-amber-600/70 mt-2">Comisiones aún no pagadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}