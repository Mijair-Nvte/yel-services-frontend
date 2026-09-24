"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CalendarDays, Radio, CalendarOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";
import { useAdminEvents } from "@/hooks/events/use-admin-events";
import { EventsAdminTable } from "@/components/events/events-admin-table";
import { OrgEvent } from "@/services/events/org-event.service";
import { EventDialog } from "@/components/org_calendar/event-dialog";

export default function EventsAdminPage() {
  const { workspaceUid } = useParams() as { workspaceUid: string };
  const router = useRouter();
  const { events, isLoading, loadData, createEvent, updateEvent, deleteEvent } = useAdminEvents(workspaceUid);
  
  // Estados para el EventDialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kpiItems: KpiItem[] = useMemo(() => {
    const total = events.length;
    const active = events.filter(e => e.is_active && new Date(e.starts_at) >= new Date()).length;
    const past = events.filter(e => new Date(e.starts_at) < new Date()).length;

    return [
      {
        label: "Total Eventos",
        value: total,
        icon: CalendarDays,
        color: "text-indigo-600",
        iconBg: "bg-indigo-100",
        cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
        hoverShadow: "hover:shadow-indigo-500/20",
        borderColor: "hover:border-indigo-400",
        subtitle: "Histórico completo",
      },
      {
        label: "Próximos / Activos",
        value: active,
        icon: Radio,
        color: "text-emerald-600",
        iconBg: "bg-emerald-100",
        cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
        hoverShadow: "hover:shadow-emerald-500/20",
        borderColor: "hover:border-emerald-400",
        subtitle: "Eventos vigentes",
      },
      {
        label: "Finalizados",
        value: past,
        icon: CalendarOff,
        color: "text-slate-600",
        iconBg: "bg-slate-100",
        cardBg: "bg-slate-50/50 dark:bg-slate-950/20",
        hoverShadow: "hover:shadow-slate-500/20",
        borderColor: "hover:border-slate-400",
        subtitle: "Eventos pasados",
      }
    ];
  }, [events]);

  // Manejador centralizado para Crear/Editar desde el Dialog
  const handleSubmitEvent = async (data: any) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent.uid, data);
    } else {
      await createEvent(data);
    }
  };

  // Manejador de borrado desde el modal o la tabla
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.uid);
      setIsDialogOpen(false);
    }
  };

  // Abre el modal en modo edición
  const handleEdit = (event: OrgEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleView = (event: OrgEvent) => {
    router.push(`/dashboard/${workspaceUid}/events/${event.uid}`);
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Gestión de Eventos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra tus eventos presenciales y virtuales, controla los asistentes y mide el impacto.
          </p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white" 
          onClick={() => {
            setSelectedEvent(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
        </Button>
      </div>

      {!isLoading && (
        <KpiCards items={kpiItems} columns="sm:grid-cols-2 lg:grid-cols-3" />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">Cargando eventos...</p>
        </div>
      ) : (
        <EventsAdminTable
          events={events}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={async (uid) => {
            if (confirm("¿Estás seguro de eliminar este evento? Esta acción es irreversible.")) {
              await deleteEvent(uid);
            }
          }}
        />
      )}

      {/* Tu componente reutilizado */}
      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        eventToEdit={selectedEvent}
      />
    </div>
  );
}