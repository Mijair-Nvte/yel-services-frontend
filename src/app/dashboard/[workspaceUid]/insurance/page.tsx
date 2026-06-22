"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Search, Loader2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminInsurance } from "@/hooks/insurance/use-admin-insurance";
import { InsuranceAdminTable } from "@/components/insurance/insurance-admin-table";
import { InsuranceAdminDialog } from "@/components/insurance/insurance-admin-dialog";
import { InsuranceApplication } from "@/services/insurance/org-insurance.service";

export default function InsuranceAdminPage() {
  const { workspaceUid } = useParams() as { workspaceUid: string };
  const { applications, isLoading, loadData, updateApplication, deleteApplication } = useAdminInsurance(workspaceUid);
  
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<InsuranceApplication | null>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      {/* Header (Sin botón de Nuevo porque el admin solo gestiona) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-indigo-600" />
            Gestión de Seguros
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra, revisa y actualiza el estatus de las solicitudes de pólizas de tus clientes.
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-slate-100">
        <div className="p-2">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <Input
          placeholder="Buscar por nombre, correo electrónico o teléfono..."
          className="border-none focus-visible:ring-0 text-sm placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
        onUpdate={updateApplication}
      />
    </div>
  );
}