import { useState, useEffect } from "react";
import { Ticket, Loader2, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrgCustomerService } from "@/services/org-customer/org-customer.service";
import { toast } from "sonner";

export function CustomerEventsTab({ workspaceUid, customerUid, customerName }: { workspaceUid: string, customerUid: string, customerName: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await OrgCustomerService.getEvents(workspaceUid, customerUid);
        console.log("Eventos desde API:", data); // Agregamos un log para confirmar qué nos manda el backend
        setEvents(data || []);
      } catch (error) {
        toast.error("Error al cargar los eventos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [workspaceUid, customerUid]);

  return (
    <Card className="shadow-sm border-slate-200/60">
      <CardHeader>
        <CardTitle>Eventos Registrados</CardTitle>
        <CardDescription>Historial de asistencia y registros a eventos de {customerName}.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <Ticket className="h-10 w-10 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Sin registros a eventos</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">El cliente no se ha registrado a ningún evento aún.</p>
            <Button variant="outline">Registrar a Evento</Button>
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium text-slate-500">Evento</th>
                  <th className="p-4 font-medium text-slate-500">Fecha de Registro</th>
                  <th className="p-4 font-medium text-slate-500">Origen</th>
                  <th className="p-4 font-medium text-slate-500">Tickets</th>
                  <th className="p-4 font-medium text-slate-500">Asistencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {events.map((reg) => (
                  <tr key={reg.uid} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="p-4">
                      {/* Aquí está el truco: Leemos .event.title */}
                      <div className="font-medium text-slate-900">
                        {reg.event?.title || `Evento #${reg.org_event_id}`}
                      </div>
                      {reg.notes && (
                        <div className="text-xs text-slate-500 mt-1 max-w-[200px] truncate" title={reg.notes}>
                          {reg.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(reg.registered_at || reg.created_at).toLocaleDateString("es-MX", { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600">
                        {reg.source || "Directo"}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-600 font-medium text-center">
                      {reg.ticket_quantity || 1}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className={reg.attended ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}
                      >
                        {reg.attended ? "Sí asistió" : "Pendiente"}
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