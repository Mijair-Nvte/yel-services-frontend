"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
// Ojo: Ya no le pasamos el "activeTab" al hook, queremos que traiga TODOS los registros
import { useOrgPartnersAdmin } from "@/hooks/org_partners/use-org-partners-admin";
import { Users } from "lucide-react";
import { PartnerReviewSheet } from "@/components/org_partners/partner-review-sheet";
import { PartnerAdminTable } from "@/components/org_partners/partner-admin-table";
import { AssignInternalPartnerModal } from "@/components/org_partners/assign-internal-partner-modal";
export default function PartnersAdminPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  // Mandamos llamar al hook (Asegúrate de que traiga todos los registros ahora)
  const { partners, loading, reload, approvePartner, rejectPartner } =
    useOrgPartnersAdmin(workspaceUid);

  const [openReview, setOpenReview] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
     
            Gestion de vendedores
          </h1>
          <p className="text-muted-foreground">
            Revisa y administra los usuarios que desean unirse al programa de afiliados.
          </p>
        </div>

        {/* 👈 AQUÍ COLOCAMOS EL BOTÓN QUE ABRE EL BUSCADOR DE SHADCN */}
        <AssignInternalPartnerModal onAssigned={reload} />
      </div>

      {/* LISTA / TABLA MODULAR */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground animate-pulse">
            <Users className="h-4 w-4" /> Cargando solicitudes...
          </div>
        ) : (
          <PartnerAdminTable
            partners={partners}
            onView={(partner) => {
              setSelectedPartner(partner);
              setOpenReview(true);
            }}
          />
        )}
      </div>

      {/* SHEET DE REVISIÓN */}
      <PartnerReviewSheet
        open={openReview}
        partner={selectedPartner}
        onClose={() => {
          setOpenReview(false);
          setSelectedPartner(null);
        }}
        onApprove={approvePartner}
        onReject={rejectPartner}
      />
    </div>
  );
}