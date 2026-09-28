"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BarChart3, Users, Ticket, Briefcase, ArrowRightLeft, Landmark,ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EventsReport } from "@/components/reporting/events-report";
import { ContactsReport } from "@/components/reporting/contacts-report";
import { SalesReport } from "@/components/reporting/sales-report"; 
import { LoansReport } from "@/components/reporting/loans-report";
import { InsuranceReport } from "@/components/reporting/insurance-report";
import { AiInsightsSidebar } from "@/components/reporting/ai-insights-sidebar";
export default function ReportingDashboardPage() {
  const { workspaceUid } = useParams() as { workspaceUid: string };

  const [start, setStart] = useState("2026-09-01");
  const [end, setEnd] = useState("2026-09-30");

  const [isComparing, setIsComparing] = useState(false);
  const [compareStart, setCompareStart] = useState("2026-08-01");
  const [compareEnd, setCompareEnd] = useState("2026-08-31");

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-50/50 min-h-screen w-full">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Centro de Reportes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Analiza el rendimiento global de tu negocio en un solo vistazo.
          </p>
        </div>

        {/* CONTROLES */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-slate-500">Periodo Principal:</Label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-8 text-xs w-32" />
            <span className="text-slate-400 text-xs">a</span>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="h-8 text-xs w-32" />
          </div>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-2 px-2">
            <Switch id="compare-mode" checked={isComparing} onCheckedChange={setIsComparing} />
            <Label htmlFor="compare-mode" className="text-sm font-medium text-slate-700 cursor-pointer">
              Comparar con:
            </Label>
          </div>

          {isComparing && (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
              <ArrowRightLeft className="h-4 w-4 text-indigo-500 mx-1" />
              <Input type="date" value={compareStart} onChange={(e) => setCompareStart(e.target.value)} className="h-8 text-xs w-32 border-indigo-200 bg-indigo-50" />
              <span className="text-slate-400 text-xs">a</span>
              <Input type="date" value={compareEnd} onChange={(e) => setCompareEnd(e.target.value)} className="h-8 text-xs w-32 border-indigo-200 bg-indigo-50" />
            </div>
          )}
          <div className="ml-auto pl-4 border-l border-slate-200">
            <AiInsightsSidebar 
              workspaceUid={workspaceUid} 
              start={start} 
              end={end} 
              isComparing={isComparing} 
              compareStart={compareStart} 
              compareEnd={compareEnd} 
            />
          </div>
        </div>
      </div>

      {/* 🧩 VISTA COMPLETA (GRID) */}
      <div className={`pb-10 ${isComparing ? "flex flex-col space-y-12" : "grid grid-cols-1 xl:grid-cols-2 gap-8"}`}>

        {/* SECCIÓN 1: CONTACTOS */}
        <section className="bg-white/40 p-5 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Contactos y Leads</h2>
          </div>
          <ContactsReport workspaceUid={workspaceUid} start={start} end={end} isComparing={isComparing} compareStart={compareStart} compareEnd={compareEnd} />
        </section>

        {isComparing && <hr className="border-slate-200/60" />}

        {/* SECCIÓN 2: EVENTOS */}
        <section className="bg-white/40 p-5 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-amber-100 rounded-md text-amber-600">
              <Ticket className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Eventos y Ticketing</h2>
          </div>
          <EventsReport workspaceUid={workspaceUid} start={start} end={end} isComparing={isComparing} compareStart={compareStart} compareEnd={compareEnd} />
        </section>

        {isComparing && <hr className="border-slate-200/60" />}

        {/* SECCIÓN 3: VENTAS Y REFERIDOS */}
        <section className="bg-white/40 p-5 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Ventas y Partners</h2>
          </div>
          <SalesReport workspaceUid={workspaceUid} start={start} end={end} isComparing={isComparing} compareStart={compareStart} compareEnd={compareEnd} />
        </section>

        <section className="bg-white/40 p-5 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-cyan-100 rounded-md text-cyan-600">
              <Landmark className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Préstamos e Hipotecas</h2>
          </div>
          <LoansReport
            workspaceUid={workspaceUid}
            start={start} end={end}
            isComparing={isComparing}
            compareStart={compareStart} compareEnd={compareEnd}
          />
        </section>
        <section className="bg-white/40 p-5 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-violet-100 rounded-md text-violet-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Seguros y Pólizas</h2>
          </div>
          <InsuranceReport 
            workspaceUid={workspaceUid} 
            start={start} end={end} 
            isComparing={isComparing} 
            compareStart={compareStart} compareEnd={compareEnd} 
          />
        </section>
      </div>
    </div>
  );
}