"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  differenceInMinutes,
  startOfDay,
  endOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  EVENT_COLORS,
  CalendarColorKey,
  DEFAULT_EVENT_COLOR,
} from "@/lib/calendar-colors";

interface Props {
  events: any[];
  view: "day" | "week" | "month";
  currentDate: Date;
  onEventClick?: (event: any) => void;
}

const HOUR_HEIGHT = 60;

/**
 * Filtro para detectar si un evento es "Todo el día" o Multidía
 */
const isAllDayOrMultiDay = (event: any) => {
  if (event.is_all_day) return true;
  const start = startOfDay(parseISO(event.starts_at));
  const end = startOfDay(
    event.ends_at ? parseISO(event.ends_at) : parseISO(event.starts_at),
  );
  return !isSameDay(start, end);
};

/**
 * Calcula posición y altura limitando el evento al día actual (para eventos normales de tiempo)
 */
const getEventStyle = (event: any, currentDay: Date) => {
  const start = parseISO(event.starts_at);
  const end = event.ends_at ? parseISO(event.ends_at) : start;

  const dayStart = startOfDay(currentDay);
  const dayEnd = endOfDay(currentDay);

  const renderStart = start < dayStart ? dayStart : start;
  const renderEnd = end > dayEnd ? dayEnd : end;

  const startMinutes = differenceInMinutes(renderStart, dayStart);
  const durationMinutes = Math.max(
    differenceInMinutes(renderEnd, renderStart),
    15,
  );

  const top = (startMinutes / 60) * HOUR_HEIGHT;
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
};

export function CalendarGrid({ events, view, currentDate,onEventClick }: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((view === "week" || view === "day") && scrollRef.current) {
      scrollRef.current.scrollTop = 480 - 40;
    }
  }, [view]);

  // ==============================
  // 🧠 PROCESAMIENTO DE EVENTOS
  // ==============================
  const allDayEvents = events.filter(isAllDayOrMultiDay);
  const timeEvents = events.filter((e) => !isAllDayOrMultiDay(e));

  // 🔥 Algoritmo Pro: Ordena y asigna un "nivel" o "fila" a cada evento multidía para que alineen perfecto
  const positionedAllDayEvents = useMemo(() => {
    const sorted = [...allDayEvents].sort((a, b) => {
      const aStart = startOfDay(parseISO(a.starts_at)).getTime();
      const bStart = startOfDay(parseISO(b.starts_at)).getTime();
      const aDuration =
        startOfDay(
          a.ends_at ? parseISO(a.ends_at) : parseISO(a.starts_at),
        ).getTime() - aStart;
      const bDuration =
        startOfDay(
          b.ends_at ? parseISO(b.ends_at) : parseISO(b.starts_at),
        ).getTime() - bStart;
      return aStart - bStart || bDuration - aDuration; // Ordenar por fecha de inicio, luego por los más largos
    });

    const rows: number[] = [];
    return sorted.map((event) => {
      const start = startOfDay(parseISO(event.starts_at)).getTime();
      const end = startOfDay(
        event.ends_at ? parseISO(event.ends_at) : parseISO(event.starts_at),
      ).getTime();

      let rowIndex = 0;
      // Si la fila actual ya está ocupada en esa fecha, saltamos a la siguiente fila hacia abajo
      while (rows[rowIndex] !== undefined && rows[rowIndex] >= start) {
        rowIndex++;
      }
      rows[rowIndex] = end;
      return { ...event, _rowIndex: rowIndex };
    });
  }, [allDayEvents]);

  // Cuántas filas de altura necesitamos para el panel superior
  const maxAllDayRow =
    positionedAllDayEvents.length > 0
      ? Math.max(...positionedAllDayEvents.map((e) => e._rowIndex))
      : -1;

  // ==============================
  // 📅 MONTH VIEW
  // ==============================
  if (view === "month") {
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const start = startOfWeek(startMonth, { weekStartsOn: 1 });
    const end = endOfWeek(endMonth, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dayName) => (
            <div
              key={dayName}
              className="p-2 text-center text-xs font-semibold text-muted-foreground border-r last:border-r-0"
            >
              {dayName}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 overflow-y-auto">
          {days.map((day) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(day, new Date());
            const dayEvents = events.filter((e) => {
              const s = parseISO(e.starts_at);
              const en = e.ends_at ? parseISO(e.ends_at) : s;
              return (
                startOfDay(day) >= startOfDay(s) &&
                startOfDay(day) <= startOfDay(en)
              );
            });

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[100px] border-b border-r p-2 relative flex flex-col gap-1",
                  !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
               <div className="flex-1 space-y-1 overflow-hidden">
                  {dayEvents.map((event) => {
                    // 🔥 1. Obtenemos el color del evento o usamos el por defecto
                    const colorTheme = EVENT_COLORS[(event.color as CalendarColorKey)] || EVENT_COLORS[DEFAULT_EVENT_COLOR];
                    
                    // 🔥 2. Verificamos si es "todo el día" para darle un estilo más sólido en el mes
                    const isAllDay = event.is_all_day || isAllDayOrMultiDay(event);

                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick && onEventClick(event)}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-colors",
                          // Si es todo el día, fondo sólido. Si es por hora, fondo claro con borde lateral
                          isAllDay 
                            ? colorTheme.allDay 
                            : cn("border bg-card shadow-sm border-l-4 text-foreground", colorTheme.timedBg, `border-l-${event.color}-500`) 
                        )}
                        // Hack rápido para el borde izquierdo dinámico si no lo tienes configurado en Tailwind de forma segura
                        style={!isAllDay ? { borderLeftColor: `var(--${event.color}-500, ${event.color})` } : {}}
                      >
                        {/* Mostramos la hora si NO es evento de todo el día */}
                        {!isAllDay && (
                            <span className="font-semibold mr-1 opacity-70">
                                {format(parseISO(event.starts_at), "HH:mm")}
                            </span>
                        )}
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==============================
  // 📅 WEEK & DAY VIEW
  // ==============================
  let daysToShow = [currentDate];
  if (view === "week") {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    daysToShow = eachDayOfInterval({ start, end });
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-col h-full bg-background rounded-lg border shadow-sm overflow-auto relative scroll-smooth custom-scrollbar"
    >
      {/* CABECERA STICKY (Fechas + Carril Todo el Día) */}
      <div className="sticky top-0 z-50 flex flex-col bg-background shadow-sm ring-1 ring-black/5 min-w-full w-max">
        {/* FILA 1: DÍAS (Lun 16, Mar 17...) */}
        <div className="flex w-full">
          <div className="w-16 shrink-0 border-r bg-background sticky left-0 z-[60]" />
          {daysToShow.map((day, index) => {
            const isToday = isSameDay(day, new Date());
            const isLast = index === daysToShow.length - 1;

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex-1 min-w-[120px] py-3 text-center bg-background",
                  !isLast && "border-r",
                )}
              >
                <div
                  className={cn(
                    "text-xs uppercase mb-1",
                    isToday
                      ? "text-primary font-bold"
                      : "text-muted-foreground",
                  )}
                >
                  {format(day, "EEE", { locale: es })}
                </div>
                <div
                  className={cn(
                    "text-xl font-semibold w-9 h-9 flex items-center justify-center rounded-full mx-auto transition-all",
                    isToday
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground",
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* FILA 2: EVENTOS TODO EL DÍA / MULTIDÍA (Alineación Perfecta) */}
        <div className="flex w-full border-t border-b border-border/50">
          <div className="w-16 shrink-0 border-r bg-background sticky left-0 z-[60] flex flex-col justify-center items-center py-1.5">
            <span className="text-[9px] text-muted-foreground font-medium uppercase text-center leading-tight">
              Todo
              <br />
              el día
            </span>
          </div>

          {daysToShow.map((day, index) => {
            const isLast = index === daysToShow.length - 1;
            const dayTime = startOfDay(day).getTime();
            const weekStartTime = startOfDay(daysToShow[0]).getTime();

            return (
              <div
                key={`allday-${day.toISOString()}`}
                className={cn(
                  "flex-1 min-w-[120px] bg-background relative py-1",
                  !isLast && "border-r",
                )}
              >
                {/* Iteramos por todas las filas posibles para mantener al resto alineado */}
                {Array.from({ length: maxAllDayRow + 1 }).map((_, rowIndex) => {
                  // Buscamos si hay un evento en esta fecha y en este piso/fila
                  const event = positionedAllDayEvents.find((e) => {
                    if (e._rowIndex !== rowIndex) return false;
                    const eStart = startOfDay(parseISO(e.starts_at)).getTime();
                    const eEnd = startOfDay(
                      e.ends_at ? parseISO(e.ends_at) : parseISO(e.starts_at),
                    ).getTime();
                    return dayTime >= eStart && dayTime <= eEnd;
                  });

                  // Si no hay evento aquí, ponemos un ladrillo transparente para que las filas no se colapsen
                  if (!event) {
                    return (
                      <div
                        key={`spacer-${rowIndex}`}
                        className="h-[22px] mb-[2px]"
                      />
                    );
                  }

                  const eStart = startOfDay(
                    parseISO(event.starts_at),
                  ).getTime();
                  const eEnd = startOfDay(
                    event.ends_at
                      ? parseISO(event.ends_at)
                      : parseISO(event.starts_at),
                  ).getTime();

                  const isRealStart = dayTime <= eStart;
                  const isRealEnd = dayTime >= eEnd;
                  const showTitle = isRealStart || dayTime === weekStartTime;
                  const colorTheme =
                    EVENT_COLORS[event.color as CalendarColorKey] ||
                    EVENT_COLORS[DEFAULT_EVENT_COLOR];
                  return (
                    <div
                      key={event.uid || event.id}
                      onClick={() => onEventClick && onEventClick(event)}
                      className={cn(
                        "h-[22px] mb-[2px] text-[11px] font-medium flex items-center overflow-hidden cursor-pointer transition-colors relative z-10",
                        colorTheme.allDay, // 🔥 APLICAMOS EL COLOR DEL DICCIONARIO
                        isRealStart
                          ? "rounded-l-md ml-1 pl-2"
                          : "rounded-none pl-2 -ml-[1px]",
                        isRealEnd
                          ? "rounded-r-md mr-1"
                          : "rounded-none w-[calc(100%+2px)]",
                      )}
                    >
                      <span className="truncate">
                        {showTitle ? event.title : "\u00A0"}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* CUERPO DEL GRID (Solo Eventos de Tiempo Regular) */}
      <div className="flex relative min-h-[1440px] bg-white min-w-full w-max">
        <div className="w-16 shrink-0 border-r bg-muted/5 select-none relative z-40 sticky left-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative w-full border-b border-transparent"
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span
                className={cn(
                  "absolute right-2 text-[11px] font-medium text-muted-foreground/70",
                  hour === 0 ? "top-1" : "-top-2.5",
                )}
              >
                {format(new Date().setHours(hour, 0), "h a")}
              </span>
            </div>
          ))}
        </div>

        {daysToShow.map((day, index) => {
          const isLast = index === daysToShow.length - 1;

          const dayEvents = timeEvents.filter((e) => {
            const start = parseISO(e.starts_at);
            const end = e.ends_at ? parseISO(e.ends_at) : start;
            if (start.getTime() === end.getTime()) return isSameDay(start, day);
            return start < endOfDay(day) && end > startOfDay(day);
          });

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 relative min-w-[120px]",
                !isLast && "border-r",
              )}
            >
              {hours.map((hour) => (
                <div
                  key={`line-${hour}`}
                  className="relative border-b border-border/60 w-full"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  <div className="absolute top-1/2 w-full border-b border-dashed border-border/30 z-0" />
                  <div
                    className="h-1/4 w-full cursor-pointer hover:bg-primary/5 transition-colors"
                    data-time={`${hour}:00`}
                  />
                  <div
                    className="h-1/4 w-full cursor-pointer hover:bg-primary/5 transition-colors"
                    data-time={`${hour}:15`}
                  />
                  <div
                    className="h-1/4 w-full cursor-pointer hover:bg-primary/5 transition-colors"
                    data-time={`${hour}:30`}
                  />
                  <div
                    className="h-1/4 w-full cursor-pointer hover:bg-primary/5 transition-colors"
                    data-time={`${hour}:45`}
                  />
                </div>
              ))}

              {dayEvents.map((event) => {
                const style = getEventStyle(event, day);
                const colorTheme =
                  EVENT_COLORS[event.color as CalendarColorKey] ||
                  EVENT_COLORS[DEFAULT_EVENT_COLOR];
                return (
                  <div
                    key={event.uid || event.id}
                    onClick={() => onEventClick && onEventClick(event)} // 🔥 AÑADIDO
                    className={cn(
                      "absolute left-1 right-1 rounded-md border p-1.5 text-xs overflow-hidden hover:z-30 transition-all cursor-pointer group z-20 flex flex-col", // 🔥 Cambié cursor-grab por cursor-pointer temporalmente
                      colorTheme.timedBg,
                    )}
                    style={style}
                  >
                    {/* LÍNEA LATERAL DINÁMICA */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 rounded-l-md",
                        colorTheme.timedBorder,
                      )}
                    />

                    <div className="pl-2 flex-1 overflow-hidden pointer-events-none">
                      <div
                        className={cn(
                          "font-bold truncate text-[11px]",
                          colorTheme.timedTextTitle,
                        )}
                      >
                        {event.title}
                      </div>
                      <div
                        className={cn(
                          "text-[10px] truncate",
                          colorTheme.timedTextTime,
                        )}
                      >
                        {format(parseISO(event.starts_at), "HH:mm")} -{" "}
                        {format(parseISO(event.ends_at), "HH:mm")}
                      </div>
                    </div>
                    <div className="h-2 w-full absolute bottom-0 left-0 cursor-ns-resize hover:bg-black/10 flex justify-center items-end pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className={cn(
                          "w-4 h-1 rounded-full",
                          colorTheme.timedBorder,
                        )}
                      />
                    </div>
                  </div>
                );
              })}

              {isSameDay(day, new Date()) && <CurrentTimeIndicator />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CurrentTimeIndicator() {
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const minutes = differenceInMinutes(now, startOfDay(now));
      const newTop = (minutes / 60) * HOUR_HEIGHT;
      setTop(newTop);
    };
    updatePosition();
    const interval = setInterval(updatePosition, 60000);
    return () => clearInterval(interval);
  }, []);

  if (top === null) return null;

  return (
    <div
      className="absolute left-0 right-0 border-t-2 border-red-500 z-30 pointer-events-none flex items-center shadow-sm"
      style={{ top: `${top}px`, transition: "top 0.5s ease-in-out" }}
    >
      <div className="w-2.5 h-2.5 bg-red-500 rounded-full -ml-1.5 border border-white shadow-sm" />
    </div>
  );
}
