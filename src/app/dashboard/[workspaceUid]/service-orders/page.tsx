"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useOrgServiceOrders } from "@/hooks/org_service_orders/use-org-service-orders";
import { OrgServiceOrderService } from "@/services/org_service_orders/org-service-order.service";
import { Input } from "@/components/ui/input";
import { Search, X, Layers } from "lucide-react";
import { toast } from "sonner";

import { ServiceOrderHeader } from "@/components/org_service_orders/service-order-header";
import { ServiceOrderBoard } from "@/components/org_service_orders/service-order-board"; // <-- Usamos el Board
import { ServiceOrderSheet } from "@/components/org_service_orders/service-order-sheet";

export default function ServiceOrdersPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { orders, loading, reload } = useOrgServiceOrders(workspaceUid);
  
  const [open, setOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    if (!query.trim()) return orders;
    return orders.filter((order) => {
      const searchString = `
        ${order.uid} 
        ${order.customer?.first_name} ${order.customer?.last_name} 
        ${order.service?.name}
      `.toLowerCase();
      
      return searchString.includes(query.toLowerCase());
    });
  }, [orders, query]);

  return (
    // Quitamos los padding excesivos para que el Pipeline ocupe bien la pantalla a lo ancho
    <div className="flex flex-col gap-6 p-4 md:p-6 h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* HEADER */}
      <ServiceOrderHeader 
        onCreate={() => {
          setEditingOrder(null);
          setOpen(true);
        }}
      />

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative w-full max-w-md group shrink-0">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground group-focus-within:text-indigo-600 transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <Input
          placeholder="Buscar servicios o cliente..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 shadow-sm"
        />
        {query.trim().length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* ÁREA DEL PIPELINE (Expande todo el alto disponible) */}
      <div className="flex-1 min-h-0 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full gap-2 text-sm font-medium text-slate-500 animate-pulse">
            <Layers className="h-5 w-5 text-indigo-500" /> Sincronizando Pipeline...
          </div>
        ) : filteredOrders.length === 0 && !query ? (
          <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
            <p className="text-sm font-medium text-slate-500">Aún no hay órdenes registradas.</p>
          </div>
        ) : (
          // Inyectamos el Tablero Kanban
          <ServiceOrderBoard
            orders={filteredOrders}
            onEdit={(order) => {
              setEditingOrder(order);
              setOpen(true);
            }}
          />
        )}
      </div>

      {/* SHEET DE GESTIÓN LATERAL */}
      <ServiceOrderSheet
        open={open}
        order={editingOrder}
        workspaceUid={workspaceUid}
        onClose={() => {
          setOpen(false);
          setEditingOrder(null);
        }}
        onSubmit={async (data) => {
          try {
            if (editingOrder) {
              await OrgServiceOrderService.update(workspaceUid, editingOrder.uid, data);
              toast.success("Trámite actualizado correctamente");
            }
            await reload();
          } catch (error: any) {
            toast.error("Ocurrió un error al guardar los cambios.");
          }
        }}
      />
    </div>
  );
}