"use client";

import { useMemo } from "react";
import {
  format,
  isToday,
  isTomorrow,
  parseISO,
  compareAsc,
  formatDistanceToNow,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  MoreHorizontal,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  EVENT_COLORS,
  CalendarColorKey,
  DEFAULT_EVENT_COLOR,
} from "@/lib/calendar-colors";
interface Props {
  events: any[];
  loading: boolean;
  view: "day" | "week" | "month";
  currentDate: Date;
  onEventClick?: (event: any) => void;
}

export function CalendarSidebar({ events, loading, view, currentDate,onEventClick }: Props) {
  // 1. Filtramos y Ordenamos los eventos
  const sortedAndFilteredEvents = useMemo(() => {
    // Primero filtramos según la vista (tu lógica original estaba bien, la mantengo optimizada)
    const filtered = events.filter((event) => {
      const eventDate = parseISO(event.starts_at);

      if (view === "day") {
        return eventDate.toDateString() === currentDate.toDateString();
      }
      if (view === "week") {
        const start = new Date(currentDate);
        start.setDate(
          start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1),
        ); // Lunes como inicio
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return eventDate >= start && eventDate <= end;
      }
      if (view === "month") {
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }
      return true;
    });

    // Ordenamos por fecha ascendente
    return filtered.sort((a, b) =>
      compareAsc(parseISO(a.starts_at), parseISO(b.starts_at)),
    );
  }, [events, view, currentDate]);

  // 2. Agrupamos por día para la vista de agenda
  const groupedEvents = useMemo(() => {
    const groups: Record<string, any[]> = {};

    sortedAndFilteredEvents.forEach((event) => {
      const dateKey = format(parseISO(event.starts_at), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return groups;
  }, [sortedAndFilteredEvents]);

  // Función para el título del grupo (Ej: "Hoy", "Mañana", "Jueves 12")
  const getGroupTitle = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Hoy";
    if (isTomorrow(date)) return "Mañana";
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Header del Sidebar */}
      <div className="mb-4 px-1">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Agenda
        </h3>
        <p className="text-sm text-muted-foreground">
          {sortedAndFilteredEvents.length} eventos programados
        </p>
      </div>

      <Separator className="mb-4" />

      {/* Lista de Eventos con Scroll */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : sortedAndFilteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4 border rounded-xl border-dashed bg-muted/20">
            <CalendarIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay eventos para esta vista.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedEvents).map((dateKey) => (
              <div key={dateKey}>
                {/* Título del Grupo de Fecha */}
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur py-1 z-10">
                  {getGroupTitle(dateKey)}
                </h4>

                <div className="space-y-3">
                  {groupedEvents[dateKey].map((event) => {
                    const start = parseISO(event.starts_at);
                    const end = event.ends_at ? parseISO(event.ends_at) : start;
                    const isPast = new Date() > end;
                    const colorTheme =
                      EVENT_COLORS[event.color as CalendarColorKey] ||
                      EVENT_COLORS[DEFAULT_EVENT_COLOR];
                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick && onEventClick(event)}
                        className={cn(
                          "cursor-pointer group relative flex flex-col gap-1 p-3 rounded-xl border bg-card transition-all hover:shadow-md", // 🔥 AÑADIDO: cursor-pointer
                          isPast
                            ? "opacity-60 bg-muted/30"
                            : "hover:border-primary/50",
                        )}
                      >
                        {/* Indicador visual lateral */}
                        <div
                          className={cn(
                            "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
                          isPast ? "bg-muted-foreground" : colorTheme.indicator
                          )}
                        />

                        <div className="pl-3">
                          {/* Título y Acciones */}
                          <div className="flex justify-between items-start">
                            <span
                              className={cn(
                                "font-medium text-sm leading-tight line-clamp-2",
                                isPast && "line-through text-muted-foreground",
                              )}
                            >
                              {event.title}
                            </span>
                            {/* Opcional: botón de menú de 3 puntos si quieres acciones rápidas */}
                            {/* <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                               <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button> */}
                          </div>

                          {/* Horario */}
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {format(start, "HH:mm")} - {format(end, "HH:mm")}
                            </span>
                          </div>

                          {/* Ubicación (Solo si existe) */}
                          {event.location && (
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[180px]">
                                {event.location}
                              </span>
                            </div>
                          )}

                          {/* Tiempo Relativo (Solo para eventos futuros/actuales de hoy) */}
                          {!isPast && isToday(start) && (
                            <div className="mt-2 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                              {formatDistanceToNow(start, {
                                addSuffix: true,
                                locale: es,
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
