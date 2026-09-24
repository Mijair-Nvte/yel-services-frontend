"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { OrgEventService, OrgEvent } from "@/services/events/org-event.service";

export function useAdminEvents(workspaceUid: string) {
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!workspaceUid) return;
    setIsLoading(true);
    try {
      const res = await OrgEventService.getAll(workspaceUid);
      setEvents(res || []);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Error al cargar los eventos.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceUid]);

  // 👇 Cambiamos el tipo de 'data' a FormData
  const createEvent = async (data: FormData) => {
    try {
      await OrgEventService.create(workspaceUid, data);
      toast.success("Evento creado correctamente.");
      await loadData();
    } catch (error: unknown) {
      toast.error("Ocurrió un error al crear el evento.");
      throw error;
    }
  };

  // 👇 Cambiamos el tipo de 'data' a FormData
  const updateEvent = async (eventUid: string, data: FormData) => {
    try {
      await OrgEventService.update(workspaceUid, eventUid, data);
      toast.success("Evento actualizado correctamente.");
      await loadData();
    } catch (error: unknown) {
      toast.error("Ocurrió un error al actualizar el evento.");
      throw error;
    }
  };

  const deleteEvent = async (eventUid: string) => {
    try {
      await OrgEventService.delete(workspaceUid, eventUid);
      toast.success("Evento eliminado correctamente.");
      await loadData();
    } catch (error: unknown) {
      toast.error("Error al eliminar el evento.");
      throw error;
    }
  };

  return {
    events,
    isLoading,
    loadData,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}