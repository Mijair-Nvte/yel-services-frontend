"use client";

import { useParams } from "next/navigation";
import { useOrgCalendar } from "@/hooks/org_calendar/use-org-calendar";
import { CalendarHeader } from "@/components/org_calendar/calendar-header";
import { CalendarGrid } from "@/components/org_calendar/calendar-grid";
import { CalendarSidebar } from "@/components/org_calendar/calendar-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventDialog } from "@/components/org_calendar/event-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CalendarPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // 🔥 ESTADO PARA EDITAR

  const calendar = useOrgCalendar(workspaceUid);

  // Función para abrir modal en modo "Crear"
  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setOpen(true);
  };

  // Función para abrir modal en modo "Editar"
const handleOpenEdit = (event: any) => {
    // 🔥 BLOQUEO PARA FERIADOS
    if (event.is_holiday) {
      toast.info(`🎉 ${event.title} es un día feriado oficial y no se puede editar.`);
      return; // Detenemos la ejecución, no se abre el modal
    }

    setSelectedEvent(event);
    setOpen(true);
  };

  // Controlador centralizado del Submit (Crear o Editar)
  const handleSubmitEvent = async (data: any) => {
    if (selectedEvent) {
      await calendar.updateEvent(selectedEvent.uid, data);
    } else {
      await calendar.createEvent(data);
    }
  };

  // Controlador para eliminar (Opcional, pero muy útil pasarlo al dialog)
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await calendar.deleteEvent(selectedEvent.uid);
      setOpen(false);
    }
  };

  return (
    <>
     

      <div className="flex h-[calc(100vh-80px)] gap-6">
        {/* LEFT SIDEBAR */}
        <div className="w-80 border-r pr-4 h-full flex flex-col overflow-hidden">
          <CalendarSidebar {...calendar} onEventClick={handleOpenEdit} /> {/* Pasamos la función */}
        </div>

        {/* RIGHT GRID */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <CalendarHeader {...calendar}  onOpenCreate={handleOpenCreate}/>

          <div className="flex-1 overflow-hidden">
            <CalendarGrid {...calendar} onEventClick={handleOpenEdit} /> {/* Pasamos la función */}
          </div>

          <EventDialog
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleSubmitEvent}
            onDelete={selectedEvent ? handleDeleteEvent : undefined} // Pasamos la función de borrar si estamos editando
            eventToEdit={selectedEvent} // Pasamos el evento a editar
          />
        </div>
      </div>
    </>
  );
}