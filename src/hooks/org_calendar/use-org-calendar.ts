"use client";

import { useEffect, useState, useCallback } from "react";
import { OrgCalendarService } from "@/services/org_calendar/org-calendar.service";
import { getHolidays } from "@/lib/holidays";
export type CalendarView = "day" | "week" | "month";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDateRange(view: CalendarView, currentDate: Date) {
  const start = new Date(currentDate);
  const end = new Date(currentDate);

  if (view === "day") {
    return {
      from: formatDate(start),
      to: formatDate(end),
    };
  }

  if (view === "week") {
    // Ajustar al Lunes de esa semana
    const day = start.getDay(); // 0 (Domingo) - 6 (Sábado)
    const diffToMonday = (day + 6) % 7; // Truco para que Lunes sea 0 y Domingo 6

    start.setDate(start.getDate() - diffToMonday);
    end.setDate(start.getDate() + 6); // Domingo final

    return {
      from: formatDate(start),
      to: formatDate(end),
    };
  }

  if (view === "month") {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0); // Último día del mes

    return {
      from: formatDate(start),
      to: formatDate(end),
    };
  }

  return {
    from: formatDate(start),
    to: formatDate(end),
  };
}

export function useOrgCalendar(workspaceUid: string) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 CONFIGURACIÓN POR DEFECTO: Siempre Semana, Siempre Hoy
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // ==============================
  // LOAD EVENTS
  // ==============================
  const loadEvents = useCallback(async () => {
    if (!workspaceUid) return;

    setLoading(true);

    try {
      const range = getDateRange(view, currentDate);

      // 1. Traemos los eventos normales del backend
      const res = await OrgCalendarService.list(workspaceUid, range);
      const dbEvents = res ?? [];

      // 2. Generamos los feriados del año actual
      const currentYear = currentDate.getFullYear();
      const holidays = getHolidays(currentYear);

      // 3. Fusionamos y guardamos en el estado 🚀
      setEvents([...dbEvents, ...holidays]);
    } catch (error) {
      console.error("Error loading events", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceUid, view, currentDate]);

  // ==============================
  // CREATE
  // ==============================
  const createEvent = async (payload: any) => {
    await OrgCalendarService.create(workspaceUid, payload);
    await loadEvents(); // Recargar tras crear
  };

  // ==============================
  // UPDATE
  // ==============================
  const updateEvent = async (eventUid: string, payload: any) => {
    await OrgCalendarService.update(workspaceUid, eventUid, payload);
    await loadEvents(); // Recargar tras editar
  };

  // ==============================
  // DELETE
  // ==============================
  const deleteEvent = async (eventUid: string) => {
    await OrgCalendarService.delete(workspaceUid, eventUid);
    await loadEvents(); // Recargar tras borrar
  };

  // Efecto principal: Cargar cuando cambie la vista, la fecha o el workspace
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    view,
    setView,
    currentDate,
    setCurrentDate,
    updateEvent,
    reload: loadEvents,
    createEvent,
    deleteEvent,
  };
}

