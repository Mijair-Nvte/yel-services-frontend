"use client";

import { Briefcase, DollarSign, Handshake, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useReportingSales } from "@/hooks/reporting/use-reporting-sales";
import { SalesPeriodData } from "@/services/reporting/org-reporting.service";

interface SalesReportProps {
    workspaceUid: string;
    start: string;
    end: string;
    isComparing: boolean;
    compareStart: string;
    compareEnd: string;
}

export function SalesReport({ workspaceUid, start, end, isComparing, compareStart, compareEnd }: SalesReportProps) {
    const { data, isLoading } = useReportingSales(workspaceUid, start, end, isComparing, compareStart, compareEnd);

    if (isLoading || !data) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 ${isComparing ? "xl:grid-cols-2 gap-8" : "gap-6"}`}>
            <div className="space-y-6">
                <div className="bg-slate-100 p-2 rounded-lg text-center font-semibold text-slate-700 text-sm">
                    Periodo: {data.primary.label}
                </div>
                <SalesReportBlock periodData={data.primary} />
            </div>

            {isComparing && data.comparison && (
                <div className="space-y-6 border-t xl:border-t-0 xl:border-l border-slate-200 xl:pl-8 pt-8 xl:pt-0">
                    <div className="bg-emerald-50 p-2 rounded-lg text-center font-semibold text-emerald-700 text-sm">
                        Comparación: {data.comparison.label}
                    </div>
                    <SalesReportBlock periodData={data.comparison} />
                </div>
            )}
        </div>
    );
}

function SalesReportBlock({ periodData }: { periodData: SalesPeriodData }) {
    const formatCurrency = (num: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(num);
    const formatNumber = (num: number) => new Intl.NumberFormat("es-MX").format(num);

    return (
        <div className="space-y-6">
            {/* KPIs FINANCIEROS */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="shadow-sm border-slate-200 bg-emerald-50/40">
                    <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
                        <CardTitle className="text-xs font-medium text-emerald-700 truncate">Ingresos (Pagado)</CardTitle>
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                        <div className="text-lg lg:text-xl font-bold text-emerald-800">{formatCurrency(periodData.kpis.total_revenue)}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
                        <CardTitle className="text-xs font-medium text-slate-500 truncate">Ventas</CardTitle>
                        <Briefcase className="h-3 w-3 text-slate-400" />
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                        <div className="text-xl font-bold text-slate-900">{formatNumber(periodData.kpis.total_sales)}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 bg-indigo-50/30">
                    <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
                        <CardTitle className="text-xs font-medium text-indigo-600 truncate">Comisiones Generadas</CardTitle>
                        <Handshake className="h-3 w-3 text-indigo-400" />
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                        <div className="text-lg lg:text-xl font-bold text-indigo-700">{formatCurrency(periodData.kpis.total_commissions)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* TOP SERVICIOS Y TIPO DE CLIENTE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Top Servicios (Ingresos)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        {periodData.topServicesChart.length === 0 ? (
                            <div className="h-[140px] flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
                        ) : (
                            <div className="h-[140px] w-full">
                                <ChartContainer config={{ revenue: { label: "Ingresos", color: "#10b981" } }} className="h-full w-full">
                                    <BarChart data={periodData.topServicesChart} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <XAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} width={80} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="revenue" name="Ingresos" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} barSize={16} />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Ventas por Tipo de Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex items-center h-[140px]">
                        {periodData.kpis.total_sales === 0 ? (
                            <div className="w-full flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
                        ) : (
                            <>
                                <div className="w-1/2 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={periodData.customerTypePie} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                                                {periodData.customerTypePie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => [`${formatNumber(value)} ventas`, "Cantidad"]} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 flex flex-col gap-2">
                                    {periodData.customerTypePie.map((item, i) => (
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
            </div>

            {/* TOP PARTNERS / REFERIDOS */}
            <Card className="shadow-sm border-slate-200 border-t-indigo-500 border-t-2">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Handshake className="h-4 w-4 text-indigo-500" /> Rendimiento de Partners
                    </CardTitle>
                    <CardDescription>Top promotores por volumen de ventas generado.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {periodData.topPartners.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">No hubo ventas por referidos en este periodo.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {periodData.topPartners.map((partner, i) => (
                                <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-slate-700 text-sm">{partner.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-900">{formatCurrency(partner.total_sales)}</div>
                                        <div className="text-[10px] text-slate-500">Comisión: {formatCurrency(partner.total_commissions)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}