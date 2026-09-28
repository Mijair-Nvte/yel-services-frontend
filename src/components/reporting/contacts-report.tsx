"use client";

import { Users, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useReportingContacts } from "@/hooks/reporting/use-reporting-contacts";
import { PeriodData } from "@/services/reporting/org-reporting.service";

const chartConfig = {
  newLeads: { label: "Nuevos", color: "#4f46e5" }, 
  existingLeads: { label: "Existentes", color: "#10b981" }, 
};

interface ContactsReportProps {
  workspaceUid: string;
  start: string;
  end: string;
  isComparing: boolean;
  compareStart: string;
  compareEnd: string;
}

export function ContactsReport({ workspaceUid, start, end, isComparing, compareStart, compareEnd }: ContactsReportProps) {
  const { data, isLoading } = useReportingContacts(workspaceUid, start, end, isComparing, compareStart, compareEnd);

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // ✅ Si hay comparación, mostramos 2 columnas en Desktop. Si no, 1 sola columna centrada.
  return (
    <div className={`grid grid-cols-1 ${isComparing ? "xl:grid-cols-2 gap-8" : "gap-6"}`}>
      
      {/* PERIODO PRINCIPAL */}
      <div className="space-y-6">
        <div className="bg-slate-100 p-2 rounded-lg text-center font-semibold text-slate-700 text-sm">
          Periodo: {data.primary.label}
        </div>
        <ReportBlock periodData={data.primary} />
      </div>

      {/* PERIODO COMPARATIVO (Aparece a la derecha) */}
      {isComparing && data.comparison && (
        <div className="space-y-6 border-t xl:border-t-0 xl:border-l border-slate-200 xl:pl-8 pt-8 xl:pt-0">
          <div className="bg-indigo-50 p-2 rounded-lg text-center font-semibold text-indigo-700 text-sm">
            Comparación: {data.comparison.label}
          </div>
          <ReportBlock periodData={data.comparison} />
        </div>
      )}
    </div>
  );
}

/** 
 * Sub-Componente Reutilizable que pinta los KPIs y gráficas de un periodo específico 
 */
function ReportBlock({ periodData }: { periodData: PeriodData }) {
  const formatNumber = (num: number) => new Intl.NumberFormat("es-MX").format(num);

  const formatDateForXAxis = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    if (day) {
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    }
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* 3 KPIs en fila */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-slate-500 truncate">Total</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-xl font-bold text-slate-900">{formatNumber(periodData.kpis.total)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 bg-indigo-50/30">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-indigo-600 truncate">Nuevos</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-xl font-bold text-indigo-700">{formatNumber(periodData.kpis.new)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 bg-emerald-50/30">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-emerald-600 truncate">Existentes</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-xl font-bold text-emerald-700">{formatNumber(periodData.kpis.existing)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de Barras */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Adquisición</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {periodData.trendChart.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
          ) : (
            <div className="h-[200px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={periodData.trendChart} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} dy={10} tickFormatter={formatDateForXAxis} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="newLeads" name="Nuevos" fill={chartConfig.newLeads.color} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="existingLeads" name="Existentes" fill={chartConfig.existingLeads.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfica de Pastel */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Fuentes (Sources)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {periodData.pieChart.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">Sin fuentes</div>
          ) : (
            <div className="flex items-center gap-4 h-[180px]">
              <div className="h-full w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={periodData.pieChart} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                      {periodData.pieChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${formatNumber(value)}`, "Cantidad"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 flex flex-col gap-2 overflow-y-auto max-h-full pr-2">
                {periodData.pieChart.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600 truncate flex-1" title={item.name}>{item.name}</span>
                    <span className="font-medium text-slate-900">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}