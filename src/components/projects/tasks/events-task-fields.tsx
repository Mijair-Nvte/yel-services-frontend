"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

interface EventsTaskFieldsProps {
  events: any[];
  selectedEventId: string;
  setSelectedEventId: (val: string) => void;
  onSelectEvent: (event: any) => void; // Callback para auto-rellenar
}

export function EventsTaskFields({
  events,
  selectedEventId,
  setSelectedEventId,
  onSelectEvent,
}: EventsTaskFieldsProps) {
  const handleChange = (eventId: string) => {
    setSelectedEventId(eventId);
    const foundEvent = events.find((e) => String(e.id) === eventId);
    if (foundEvent) {
      onSelectEvent(foundEvent);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Vinculación con evento oficial
        </h4>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Seleccionar Evento</Label>
        <Select value={selectedEventId} onValueChange={handleChange}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Selecciona un evento para auto-rellenar..." />
          </SelectTrigger>
          <SelectContent>
            {events.length === 0 ? (
              <div className="px-2 py-2 text-center text-xs text-muted-foreground">
                No hay eventos registrados
              </div>
            ) : (
              events.map((event) => (
                <SelectItem key={event.id} value={String(event.id)}>
                  {event.title} (
                  {new Date(event.starts_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                  })}
                  )
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Al seleccionar el evento, se completarán automáticamente el nombre, descripción y fechas.
        </p>
      </div>
    </div>
  );
}