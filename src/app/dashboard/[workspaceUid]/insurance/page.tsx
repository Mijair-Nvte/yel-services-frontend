"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Search, Loader2, ShieldCheck, Clock, CheckCircle, DollarSign, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminInsurance } from "@/hooks/insurance/use-admin-insurance";
import { InsuranceAdminTable } from "@/components/insurance/insurance-admin-table";
import { InsuranceAdminDialog } from "@/components/insurance/insurance-admin-dialog";
import { InsuranceApplication } from "@/services/insurance/org-insurance.service";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";

export default function InsuranceAdminPage() {
  const { workspaceUid } = useParams() as { workspaceUid: string };
  const { applications, isLoading, loadData, updateApplication, deleteApplication } = useAdminInsurance(workspaceUid);
  
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<InsuranceApplication | null>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrado de búsqueda actualizado para leer del customer
  const filteredApplications = useMemo(() => {
    if (!search) return applications;
    const lowerSearch = search.toLowerCase();
    
    return applications.filter((app) => {
      const name = app.customer ? `${app.customer.first_name} ${app.customer.last_name}` : app.applicant_name;
      const email = app.customer?.email || app.applicant_email;
      const phone = app.customer?.phone || app.applicant_phone;
      
      return (
        name.toLowerCase().includes(lowerSearch) ||
        email.toLowerCase().includes(lowerSearch) ||
        phone.includes(lowerSearch)
      );
    });
  }, [applications, search]);

  // Cálculos de KPIs dinámicos
  const kpiItems: KpiItem[] = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === "pending" || a.status === "reviewing").length;
    const approved = applications.filter(a => a.status === "approved").length;
    
    // Cálculo de comisiones pagadas
    const paidCommissions = applications
      .filter((app) => app.commission_status === "paid")
      .reduce((acc, app) => acc + (Number(app.commission_amount) || 0), 0);

    // Cálculo de comisiones pendientes por pagar
    const pendingCommissions = applications
      .filter((app) => app.commission_status === "pending")
      .reduce((acc, app) => acc + (Number(app.commission_amount) || 0), 0);

    return [
      {
        label: "Total Solicitudes",
        value: total,
        icon: ShieldCheck,
        color: "text-indigo-600",
        iconBg: "bg-indigo-100",
        cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
        hoverShadow: "hover:shadow-indigo-500/20",
        borderColor: "hover:border-indigo-400",
        subtitle: "Todas las solicitudes",
      },
      {
        label: "En Proceso",
        value: pending,
        icon: Clock,
        color: "text-amber-600",
        iconBg: "bg-amber-100",
        cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
        hoverShadow: "hover:shadow-amber-500/20",
        borderColor: "hover:border-amber-400",
        subtitle: "Pendientes / Revisión",
      },
      {
        label: "Aprobadas",
        value: approved,
        icon: CheckCircle,
        color: "text-emerald-600",
        iconBg: "bg-emerald-100",
        cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
        hoverShadow: "hover:shadow-emerald-500/20",
        borderColor: "hover:border-emerald-400",
        subtitle: "Pólizas emitidas",
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
        subtitle: "Liquidadas",
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
        subtitle: "Por liquidar",
      }
    ];
  }, [applications]);

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
         
            Gestión de Seguros
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra, revisa y actualiza el estatus de las solicitudes de pólizas de tus clientes.
          </p>
        </div>
      </div>

      {/* Sección de KPIs Modulares con 5 columnas */}
      {!isLoading && (
        <KpiCards items={kpiItems} columns="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" />
      )}

   

      {/* Grid de Contenido */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">Cargando solicitudes...</p>
        </div>
      ) : (
        <InsuranceAdminTable
          applications={filteredApplications}
          onEdit={(app) => {
            setSelectedApplication(app);
            setIsDialogOpen(true);
          }}
          onDelete={async (uid: string) => {
            if (confirm("¿Estás seguro de eliminar esta solicitud? Esta acción es irreversible.")) {
              await deleteApplication(uid);
            }
          }}
        />
      )}

      {/* Modal / Dialogo de Edición */}
      <InsuranceAdminDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        application={selectedApplication}
        onUpdate={updateApplication as any} 
      />
    </div>
  );
}