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
         
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
        </Button>
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
          services={services}
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
