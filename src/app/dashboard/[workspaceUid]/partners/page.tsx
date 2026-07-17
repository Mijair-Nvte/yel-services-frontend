"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useOrgPartnersAdmin } from "@/hooks/org_partners/use-org-partners-admin";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X, Users, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PartnerReviewSheet } from "@/components/org_partners/partner-review-sheet";

export default function PartnersAdminPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  // Estado para las pestañas de filtro (pending, approved, rejected)
  const [activeTab, setActiveTab] = useState("pending");

  const { partners, loading, reload, approvePartner, rejectPartner } =
    useOrgPartnersAdmin(workspaceUid, activeTab);

  const [openReview, setOpenReview] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [query, setQuery] = useState("");

  // Buscador local en memoria
  const filteredPartners = useMemo(() => {
    if (!query.trim()) return partners;
    return partners.filter((p) => {
      const name = p.user?.name || "";
      const email = p.user?.email || "";
      return `${name} ${email}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [partners, query]);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      {/* HEADER TIPO "LINKS" */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="h-8 w-8 text-emerald-600" />
          Solicitudes de Partners
        </h1>
        <p className="text-muted-foreground">
          Revisa y administra los usuarios que desean unirse al programa de
          afiliados.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* TABS PARA FILTRAR */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="approved">Aprobados</TabsTrigger>
            <TabsTrigger value="rejected">Rechazados</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* SEARCH BAR - Estilo minimalista */}
        <div className="relative w-full max-w-sm group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Buscar por nombre o correo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-10 bg-white dark:bg-slate-950 border-border/60 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400 shadow-sm"
          />
          {query.trim().length > 0 && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* LISTA / TABLA */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground animate-pulse">
            <Users className="h-4 w-4" /> Cargando solicitudes...
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border/60 bg-slate-50/50">
            <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-bold text-muted-foreground">
              No hay solicitudes en estado "{activeTab}"{" "}
              {query ? `para "${query}"` : ""}
            </p>
          </div>
        ) : (
          <div className="border border-border/60 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-border/60 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Formulario Fiscal</th>
                  <th className="px-6 py-4">Código Referido</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {partner.tax_form_data?.legal_name ||
                          partner.user?.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {partner.user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="uppercase font-mono text-[10px]"
                      >
                        {partner.tax_form_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {partner.referral_code ? (
                        <code className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                          {partner.referral_code}
                        </code>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedPartner(partner);
                          setOpenReview(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" /> Revisar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
