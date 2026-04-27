"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { LinkMappingService } from "@/services/org_sales/link-mappings.service";
import { OrgUserService } from "@/services/org_settings/users/org-user.service";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2, Users2 } from "lucide-react";
import { MappingsGrouped } from "@/components/link-mappings/mappings-grouped"; // Nuevo componente
import { MappingDialog } from "@/components/link-mappings/mapping-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LinkMappingsPage() {
  const { workspaceUid } = useParams() as { workspaceUid: string };
  const [mappings, setMappings] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<any>(null);

  const loadData = useCallback(async () => {
    if (!workspaceUid) return;
    try {
      setIsLoading(true);
      const mappingsRes = await LinkMappingService.getAll(workspaceUid);
      const teamRes = await OrgUserService.getDirectory(workspaceUid);
      setMappings(mappingsRes || []);
      setSellers(Array.isArray(teamRes) ? teamRes : teamRes.data || []);
    } catch (error) {
      toast.error("Error al sincronizar con el servidor");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceUid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- LÓGICA DE AGRUPAMIENTO PRO ---
  const groupedData = useMemo(() => {
    const filtered = mappings.filter(
      (m) =>
        m.service_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.seller?.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.ghl_payment_link_id?.toLowerCase().includes(search.toLowerCase()),
    );

    // Agrupamos por el nombre del vendedor
    return filtered.reduce((acc: any, current: any) => {
      const sellerName = current.seller?.name || "Sin Vendedor Asignado";
      if (!acc[sellerName]) {
        acc[sellerName] = {
          seller: current.seller,
          links: [],
        };
      }
      acc[sellerName].links.push(current);
      return acc;
    }, {});
  }, [mappings, search]);

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900  flex items-center gap-3">
            Gestión de Enlaces
          </h1>
          <p className="text-slate-500 text-sm ">
            Organiza y asigna enlaces de pago de GoHighLevel a tu equipo.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedMapping(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Enlace
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-slate-100">
        <div className="p-2">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <Input
          placeholder="Buscar por vendedor, servicio o ID..."
          className="border-none focus-visible:ring-0 text-sm placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">
            Cargando organización...
          </p>
        </div>
      ) : (
        <MappingsGrouped
          groupedData={groupedData}
          onEdit={(m: any) => {
            setSelectedMapping(m);
            setIsDialogOpen(true);
          }}
          onDelete={async (uid: string) => {
            if (confirm("¿Eliminar?")) {
              await LinkMappingService.delete(workspaceUid, uid);
              loadData();
            }
          }}
        />
      )}

      <MappingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mapping={selectedMapping}
        sellers={sellers}
        workspaceUid={workspaceUid}
        onSuccess={loadData}
      />
    </div>
  );
}
