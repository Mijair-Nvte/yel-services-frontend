"use client";

import { useState } from "react";
import { Sparkles, Loader2, BrainCircuit, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { OrgReportingService } from "@/services/reporting/org-reporting.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AiInsightsSidebarProps {
  workspaceUid: string;
  start: string;
  end: string;
  isComparing: boolean;
  compareStart: string;
  compareEnd: string;
}

export function AiInsightsSidebar({ workspaceUid, start, end, isComparing, compareStart, compareEnd }: AiInsightsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  
  // 🧠 CACHÉ: Guardamos los parámetros exactos del último análisis
  const [lastFetchedParams, setLastFetchedParams] = useState<string | null>(null);

  const fetchInsights = async (forceRefresh = false) => {
    const currentParams = JSON.stringify({ start, end, isComparing, compareStart, compareEnd });

    if (insights && !forceRefresh && lastFetchedParams === currentParams) {
      return; 
    }

    setIsLoading(true);
    if (forceRefresh) setInsights(null); 
    
    try {
      const activeCompareStart = isComparing ? compareStart : null;
      const activeCompareEnd = isComparing ? compareEnd : null;
      
      const res = await OrgReportingService.generateAiInsights(workspaceUid, start, end, activeCompareStart, activeCompareEnd);
      
      if (res.success && res.insights) {
        setInsights(res.insights);
        setLastFetchedParams(currentParams);
      } else {
        toast.error(res.message || "No se pudo generar el análisis.");
      }
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 429 || error?.status === 429) {
        toast.error("Límite alcanzado. Por favor, espera 1 minuto para no saturar a la IA.");
      } else {
        toast.error("Ocurrió un error al contactar con el Copiloto.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) fetchInsights(); 
  };

  // Función para parsear texto en negrita y darle un toque SaaS (resaltado sutil)
  const parseBoldText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-indigo-950 bg-indigo-50/80 px-1.5 py-0.5 rounded-md border border-indigo-100/50">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Renderizador de Markdown SaaS-Grade
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== ''); // Limpiar líneas vacías
    
    return lines.map((line, i) => {
      // H1
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-extrabold mt-8 mb-4 text-slate-900 tracking-tight flex items-center gap-2">{line.replace('# ', '')}</h1>;
      }
      // H2
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-lg font-bold mt-8 mb-4 text-slate-800 flex items-center pb-2 border-b border-slate-100">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // H3
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-base font-semibold mt-6 mb-3 text-indigo-900">{line.replace('### ', '')}</h3>;
      }
      // Listas
      if (line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={i} className="flex items-start gap-3 mb-3 group">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors shrink-0 shadow-sm" />
            <div className="text-slate-600 text-sm leading-relaxed">{parseBoldText(content)}</div>
          </div>
        );
      }
      // Párrafos normales
      return <p key={i} className="mb-4 text-slate-600 text-sm leading-relaxed">{parseBoldText(line)}</p>;
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="relative group overflow-hidden bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all hover:shadow-indigo-500/10 gap-2">
          {/* Fondo sutil animado al hacer hover */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <BrainCircuit className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium">Copiloto IA</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto border-l-0 shadow-2xl flex flex-col p-0">
        
        {/* HEADER PREMIUM */}
        <SheetHeader className="bg-white p-6 border-b border-slate-200/60 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-100/40 to-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-indigo-50 rounded-md border border-indigo-100">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <SheetTitle className="text-lg font-bold text-slate-900">
                  Copiloto de Datos YEL
                </SheetTitle>
              </div>
              <SheetDescription className="text-slate-500 text-sm mt-1">
                Análisis estratégico y detección de anomalías generados en tiempo real.
              </SheetDescription>
            </div>
            
            {insights && !isLoading && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200" 
                onClick={() => fetchInsights(true)}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Actualizar</span>
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* CONTENIDO */}
        <div className="p-6 flex-grow relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <BrainCircuit className="h-6 w-6 text-indigo-600 animate-pulse" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-semibold text-slate-700">Analizando métricas...</p>
                <p className="text-xs text-slate-500">Cruzando datos operativos e identificando tendencias.</p>
              </div>
            </div>
          ) : insights ? (
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed">
                {renderFormattedText(insights)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-3">
              <div className="p-3 bg-slate-100 rounded-full">
                <BrainCircuit className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 max-w-[250px]">
                No se pudo cargar la información. Verifica tu conexión o intenta nuevamente.
              </p>
              <Button variant="outline" onClick={() => fetchInsights(true)} className="mt-2">
                Reintentar
              </Button>
            </div>
          )}
        </div>
        
      </SheetContent>
    </Sheet>
  );
}