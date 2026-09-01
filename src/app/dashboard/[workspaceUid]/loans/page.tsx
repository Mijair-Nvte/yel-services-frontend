"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2, FileSpreadsheet, Clock, CheckCircle2, DollarSign, AlertCircle } from "lucide-react";
import { useAdminLoans } from "@/hooks/org_loans/use-loans";
import { LoanTable } from "@/components/org_loans/loan-admin-table";
import { LoanAdminSheet } from "@/components/org_loans/loan-admin-sheet";
import { LoanApplication } from "@/services/org-loan/org-loan.service";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";

export default function PageLoans() {
  const { workspaceUid } = useParams() as { workspaceUid: string };
  const { applications, isLoading, loadData, updateApplication, deleteApplication } = useAdminLoans(workspaceUid);
  
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cálculo de KPIs dinámicos para Préstamos
  const kpiItems: KpiItem[] = useMemo(() => {
    const total = applications.length;
    const Open = applications.filter((app) => app.status === "Open").length;
    const Won = applications.filter((app) => app.status === "Won").length;
    
    const estimatedSum = applications.reduce((acc, app) => acc + (Number(app.estimated_amount) || 0), 0);
    const paidCommissions = applications
      .filter((app) => app.commission_status === "paid")
      .reduce((acc, app) => acc + (Number(app.commission_amount) || 0), 0);

      const pendingCommissions = applications
      .filter((app) => app.commission_status === "pending")
      .reduce((acc, app) => acc + (Number(app.commission_amount) || 0), 0);

    return [
      {
        label: "Total Solicitudes",
        value: total,
        icon: FileSpreadsheet,
        color: "text-blue-600",
        iconBg: "bg-blue-100",
        cardBg: "bg-blue-50/50 dark:bg-blue-950/20",
        hoverShadow: "hover:shadow-blue-500/20",
        borderColor: "hover:border-blue-400",
        subtitle: "Registradas"
      },
      {
        label: "Pendientes",
        value: Open,
        icon: Clock,
        color: "text-amber-600",
        iconBg: "bg-amber-100",
        cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
        hoverShadow: "hover:shadow-amber-500/20",
        borderColor: "hover:border-amber-400",
        subtitle: "Por revisar"
      },
      {
        label: "Ganados",
        value: Won,
        icon: CheckCircle2,
        color: "text-emerald-600",
        iconBg: "bg-emerald-100",
        cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
        hoverShadow: "hover:shadow-emerald-500/20",
        borderColor: "hover:border-emerald-400",
        subtitle: "Exitosos"
      },
      {
        label: "Volumen Estimado",
        value: `$${estimatedSum.toLocaleString()}`,
        icon: DollarSign,
        color: "text-indigo-600",
        iconBg: "bg-indigo-100",
        cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
        hoverShadow: "hover:shadow-indigo-500/20",
        borderColor: "hover:border-indigo-400",
        subtitle: "Monto total"
      },
      {
        label: "Comisiones Pagadas",
        value: `$${paidCommissions.toLocaleString()}`,
        icon: DollarSign,
        color: "text-purple-600",
        iconBg: "bg-purple-100",
        cardBg: "bg-purple-50/50 dark:bg-purple-950/20",
        hoverShadow: "hover:shadow-purple-500/20",
        borderColor: "hover:border-purple-400",
        subtitle: "Liquidadas"
      },
       {
        label: "Comisiones Pendientes",
        value: `$${pendingCommissions.toLocaleString()}`,
        icon: AlertCircle,
        color: "text-orange-600",
        iconBg: "bg-orange-100",
        cardBg: "bg-orange-50/50 dark:bg-orange-950/20",
        hoverShadow: "hover:shadow-orange-500/20",
        borderColor: "hover:border-orange-400",
        subtitle: "Por liquidar"
      }
    ];
  }, [applications]);

  // Filtrado de búsqueda en tiempo real
  const filteredApplications = useMemo(() => {
    if (!search) return applications;
    const lowerSearch = search.toLowerCase();
    return applications.filter(
      (app) =>
        app.applicant_name.toLowerCase().includes(lowerSearch) ||
        app.applicant_email.toLowerCase().includes(lowerSearch) ||
        app.applicant_phone.includes(lowerSearch)
    );
  }, [applications, search]);

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Gestión de Préstamos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra, revisa y actualiza el estatus y comisiones de las solicitudes de préstamos.
          </p>
        </div>
      </div>

      {/* Renderizamos las Tarjetas de KPIs Modulares */}
      {!isLoading && <KpiCards items={kpiItems} columns="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" />}

      {/* Grid de Contenido */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">Cargando solicitudes de préstamos...</p>
        </div>
      ) : (
        <LoanTable
          applications={filteredApplications}
          onEdit={(app) => {
            setSelectedApplication(app);
            setIsSheetOpen(true);
          }}
          onDelete={async (uid: string) => {
            if (confirm("¿Estás seguro de eliminar esta solicitud? Esta acción es irreversible.")) {
              await deleteApplication(uid);
            }
          }}
        />
      )}

      {/* Sheet de Edición Lateral */}
      <LoanAdminSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        application={selectedApplication}
        onUpdate={updateApplication}
        onDelete={deleteApplication}
      />
    </div>
  );
}