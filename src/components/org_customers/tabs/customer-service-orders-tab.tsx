import { useState, useEffect } from "react";
import { Briefcase, Loader2, CalendarDays, ShoppingCart, Cog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrgCustomerService } from "@/services/org-customer/org-customer.service";
import { toast } from "sonner";

export function CustomerServiceOrdersTab({ workspaceUid, customerUid, customerName }: { workspaceUid: string, customerUid: string, customerName: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrgCustomerService.getServiceOrders(workspaceUid, customerUid);
        console.log("Órdenes de servicio:", data);
        setOrders(data || []);
      } catch (error) {
        toast.error("Error al cargar las órdenes de servicio.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [workspaceUid, customerUid]);

  // Función para darle color a los estados de la orden
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "pending" || s === "open") return "bg-amber-100 text-amber-700 hover:bg-amber-200";
    if (s === "in_progress" || s === "active") return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    if (s === "completed" || s === "done") return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
    if (s === "cancelled") return "bg-red-100 text-red-700 hover:bg-red-200";
    return "bg-slate-100 text-slate-700 hover:bg-slate-200";
  };

  // Función para traducir o mejorar la vista del origen (initiated_by)
  const formatSource = (source?: string) => {
    if (source === "stripe_webhook") return "Stripe (Pago Online)";
    if (source === "manual") return "Creación Manual";
    return source || "Desconocido";
  };

  return (
    <Card className="shadow-sm border-slate-200/60">
      <CardHeader>
        <CardTitle>Servicios y Órdenes</CardTitle>
        <CardDescription>Historial de servicios adquiridos y operativos por {customerName}.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <Briefcase className="h-10 w-10 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay ventas ni órdenes</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">No se han registrado compras o servicios operativos para este cliente.</p>
            <Button variant="outline">Crear Orden</Button>
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium text-slate-500">Servicio</th>
                  <th className="p-4 font-medium text-slate-500">Venta Relacionada</th>
                  <th className="p-4 font-medium text-slate-500">Origen</th>
                  <th className="p-4 font-medium text-slate-500">Fecha de Creación</th>
                  <th className="p-4 font-medium text-slate-500">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order.uid} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <Cog className="h-4 w-4 text-indigo-500" />
                        {/* HUSTO A PANAGBASA: .service?.name */}
                        {order.service?.name || `Servicio #${order.org_service_id}`}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">
                        {order.uid}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-slate-400" />
                          <span className="font-mono text-xs text-slate-500">
                       
                            {order.sale?.uid || `Venta #${order.org_sale_id}`}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600">
                        {formatSource(order.metadata?.initiated_by)}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(order.created_at).toLocaleDateString("es-MX", {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={getStatusBadge(order.status)}
                      >
                        {order.status === "pending" ? "Pendiente" : order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}