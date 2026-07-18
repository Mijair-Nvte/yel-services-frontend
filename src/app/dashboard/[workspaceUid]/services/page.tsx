"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { OrgServicesService } from "@/services/org_sales/services.service";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ServicesGrid } from "@/components/services/services-grid";
import { ServiceDialog } from "@/components/services/service-dialog";

export default function ServicesPage() {
  const { workspaceUid } = useParams() as { workspaceUid: string };
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const loadData = useCallback(async () => {
    if (!workspaceUid) return;
    try {
      setIsLoading(true);
      const res = await OrgServicesService.getAll(workspaceUid);
      setServices(res || []);
    } catch (error) {
      toast.error("Error al cargar los servicios");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceUid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrado de búsqueda en tiempo real
  const filteredServices = useMemo(() => {
    if (!search) return services;
    const lowerSearch = search.toLowerCase();
    return services.filter(
      (s) =>
        s.name?.toLowerCase().includes(lowerSearch) ||
       s.uid?.toLowerCase().includes(lowerSearch) ||
        s.stripe_product_id?.toLowerCase().includes(lowerSearch) ||
        s.stripe_price_id?.toLowerCase().includes(lowerSearch),
    );
  }, [services, search]);

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Gestión de Servicios
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra tus productos, precios de Stripe y reglas de comisión
            para afiliados.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedService(null);
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
        </Button>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-slate-100">
        <div className="p-2">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <Input
          placeholder="Buscar por nombre, Product ID o Price ID..."
          className="border-none focus-visible:ring-0 text-sm placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid de Contenido */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">
            Cargando servicios...
          </p>
        </div>
      ) : (
        <ServicesGrid
          services={filteredServices}
          onEdit={(service: any) => {
            setSelectedService(service);
            setIsDialogOpen(true);
          }}
          onDelete={async (uid: string) => {
            if (
              confirm(
                "¿Estás seguro de eliminar este servicio? Las ventas vinculadas no se borrarán.",
              )
            ) {
              try {
                await OrgServicesService.delete(workspaceUid, uid);
                toast.success("Servicio eliminado");
                loadData();
              } catch (e) {
                toast.error("Error al eliminar");
              }
            }
          }}
        />
      )}

      {/* Modal / Dialogo */}
      <ServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        workspaceUid={workspaceUid}
        onSuccess={loadData}
      />
    </div>
  );
}
