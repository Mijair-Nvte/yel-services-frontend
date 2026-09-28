"use client";

import { Ticket, Users, Percent, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useReportingEvents } from "@/hooks/reporting/use-reporting-events";
import { EventPeriodData } from "@/services/reporting/org-reporting.service";

interface EventsReportProps {
  workspaceUid: string;
  start: string;
  end: string;
  isComparing: boolean;
  compareStart: string;
  compareEnd: string;
}

export function EventsReport({ workspaceUid, start, end, isComparing, compareStart, compareEnd }: EventsReportProps) {
  const { data, isLoading } = useReportingEvents(workspaceUid, start, end, isComparing, compareStart, compareEnd);

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${isComparing ? "xl:grid-cols-2 gap-8" : "gap-6"}`}>
      
      {/* PERIODO PRINCIPAL */}
      <div className="space-y-6">
        <div className="bg-slate-100 p-2 rounded-lg text-center font-semibold text-slate-700 text-sm">
          Periodo: {data.primary.label}
        </div>
        <EventReportBlock periodData={data.primary} />
      </div>

      {/* PERIODO COMPARATIVO */}
      {isComparing && data.comparison && (
        <div className="space-y-6 border-t xl:border-t-0 xl:border-l border-slate-200 xl:pl-8 pt-8 xl:pt-0">
          <div className="bg-amber-50 p-2 rounded-lg text-center font-semibold text-amber-700 text-sm">
            Comparación: {data.comparison.label}
          </div>
          <EventReportBlock periodData={data.comparison} />
        </div>
      )}
    </div>
  );
}

/** 
 * Sub-Componente Reutilizable para Eventos
 */
function EventReportBlock({ periodData }: { periodData: EventPeriodData }) {
  const formatNumber = (num: number) => new Intl.NumberFormat("es-MX").format(num);

  // Helper para pintar Mini-Pies
  const renderMiniPie = (dataArray: any[], title: string) => (
    <div className="flex flex-col items-center">
      <h4 className="text-xs font-semibold text-slate-500 mb-2">{title}</h4>
      <div className="h-28 w-full flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dataArray} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={2} dataKey="value">
              {dataArray.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${formatNumber(value)}`, "Registros"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2 px-2">
        {dataArray.map((item, i) => (
          <div key={i} className="flex items-center gap-1 text-[10px]">
            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
            <span className="text-slate-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 3 KPIs en fila */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-medium text-slate-500 truncate">Eventos</CardTitle>
            <Ticket className="h-3 w-3 text-slate-400" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-xl font-bold text-slate-900">{formatNumber(periodData.kpis.total_events)}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 bg-blue-50/30">
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-medium text-blue-600 truncate">Registros</CardTitle>
            <Users className="h-3 w-3 text-blue-400" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-xl font-bold text-blue-700">{formatNumber(periodData.kpis.total_registrations)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-amber-50/30">
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-medium text-amber-600 truncate">Tasa Asistencia</CardTitle>
            <Percent className="h-3 w-3 text-amber-400" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-xl font-bold text-amber-700">{periodData.kpis.attendance_rate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de Barras: Top 5 Eventos */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Top 5 Eventos (Por Registros)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {periodData.topEventsChart.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">Sin eventos en este periodo</div>
          ) : (
            <div className="h-[180px] w-full">
              <ChartContainer config={{ registrations: { label: "Registros", color: "#f59e0b" } }} className="h-full w-full">
                <BarChart data={periodData.topEventsChart} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <XAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="registrations" name="Registros" fill="var(--color-registrations)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desglose: 3 Gráficas de Pastel en Grid */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Desglose de Audiencia</CardTitle>
          <CardDescription>Comportamiento y origen de los registrados.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
           {periodData.kpis.total_registrations === 0 ? (
            <div className="h-[150px] flex items-center justify-center text-slate-400 text-sm">Sin datos para desglosar</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {renderMiniPie(periodData.attendancePie, "Asistencia")}
              {renderMiniPie(periodData.leadTypePie, "Calidad Lead")}
              {renderMiniPie(periodData.sourcesPie, "Orígenes")}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}