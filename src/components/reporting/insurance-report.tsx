"use client";

import { ShieldCheck, CheckCircle2, Handshake, Percent, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useReportingInsurance } from "@/hooks/reporting/use-reporting-insurance";
import { InsurancePeriodData } from "@/services/reporting/org-reporting.service";

interface InsuranceReportProps {
  workspaceUid: string;
  start: string;
  end: string;
  isComparing: boolean;
  compareStart: string;
  compareEnd: string;
}

export function InsuranceReport({ workspaceUid, start, end, isComparing, compareStart, compareEnd }: InsuranceReportProps) {
  const { data, isLoading } = useReportingInsurance(workspaceUid, start, end, isComparing, compareStart, compareEnd);

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${isComparing ? "xl:grid-cols-2 gap-8" : "gap-6"}`}>
      <div className="space-y-6">
        <div className="bg-slate-100 p-2 rounded-lg text-center font-semibold text-slate-700 text-sm">
          Periodo: {data.primary.label}
        </div>
        <InsuranceReportBlock periodData={data.primary} />
      </div>

      {isComparing && data.comparison && (
        <div className="space-y-6 border-t xl:border-t-0 xl:border-l border-slate-200 xl:pl-8 pt-8 xl:pt-0">
          <div className="bg-violet-50 p-2 rounded-lg text-center font-semibold text-violet-700 text-sm">
            Comparación: {data.comparison.label}
          </div>
          <InsuranceReportBlock periodData={data.comparison} />
        </div>
      )}
    </div>
  );
}

function InsuranceReportBlock({ periodData }: { periodData: InsurancePeriodData }) {
  const formatCurrency = (num: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
  const formatNumber = (num: number) => new Intl.NumberFormat("es-MX").format(num);

  return (
    <div className="space-y-6">
      {/* 4 KPIs FINANCIEROS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="shadow-sm border-slate-200 bg-violet-50/40">
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-medium text-violet-700 truncate">Pólizas</CardTitle>
            <ShieldCheck className="h-3 w-3 text-violet-500" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-lg font-bold text-violet-800">{formatNumber(periodData.kpis.total_applications)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-medium text-emerald-600 truncate">Ganados (Won)</CardTitle>
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-lg font-bold text-emerald-700">{formatNumber(periodData.kpis.won_applications)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-medium text-slate-500 truncate">Cierre (%)</CardTitle>
            <Percent className="h-3 w-3 text-slate-400" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-lg font-bold text-slate-900">{periodData.kpis.conversion_rate}%</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-indigo-50/30">
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-medium text-indigo-600 truncate">Comisiones</CardTitle>
            <Handshake className="h-3 w-3 text-indigo-400" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-lg font-bold text-indigo-700">{formatCurrency(periodData.kpis.total_commissions)}</div>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICAS DE PASTEL Y BARRAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Gráfica de Pastel: Estado */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Pipeline de Seguros</CardTitle>
            <CardDescription className="text-xs">Distribución de estados.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center h-[160px]">
             {periodData.kpis.total_applications === 0 ? (
                <div className="w-full flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
             ) : (
                <>
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={periodData.pipelinePie} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                          {periodData.pipelinePie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${formatNumber(value)} apps`, "Cantidad"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col gap-2 overflow-y-auto max-h-full pr-1">
                    {periodData.pipelinePie.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-semibold ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
             )}
          </CardContent>
        </Card>

        {/* Gráfica de Barras: Tipos de Seguros */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Top Tipos (Por Cantidad)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {periodData.insuranceTypesChart.length === 0 ? (
              <div className="h-[160px] flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
            ) : (
              <div className="h-[160px] w-full">
                <ChartContainer config={{ count: { label: "Pólizas", color: "#8b5cf6" } }} className="h-full w-full">
                  <BarChart data={periodData.insuranceTypesChart} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <XAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} width={70} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" name="Pólizas" fill="var(--color-count)" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}