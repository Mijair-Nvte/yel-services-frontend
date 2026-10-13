"use client";

import React, { useMemo } from "react";
import { EventRegistration, OrgEventService } from "@/services/events/org-event.service";
import { DataTable } from "@/components/ui/data-table";
import { getAttendeesColumns } from "./attendees-columns";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface AttendeesTableProps {
  registrations: EventRegistration[];
  onDeleteSuccess?: (uid: string) => void;
}

// 1. Extraemos onDeleteSuccess de los props 👇
export function AttendeesTable({ registrations, onDeleteSuccess }: AttendeesTableProps) {
  const params = useParams() as { workspaceUid: string; eventUid: string };

  const handleDeleteRegistration = async (registration: EventRegistration) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el registro de ${registration.customer?.first_name || 'este usuario'}?`)) {
      return;
    }

    try {
      await OrgEventService.deleteRegistration(params.workspaceUid, params.eventUid, registration.uid);
      toast.success("Registro eliminado exitosamente");

      // Llamamos al padre para actualizar el estado
      if (onDeleteSuccess) {
        onDeleteSuccess(registration.uid);
      }
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el registro.");
    }
  };

  // 2. Le pasamos la función onDelete a las columnas 👇
  const columns = useMemo(() => getAttendeesColumns({ onDelete: handleDeleteRegistration }), [params.workspaceUid, params.eventUid]);

  return (
    <DataTable
      columns={columns}
      data={registrations}
      filterColumn="status"
      filterOptions={[
        { label: "Asistió", value: "attended" },
        { label: "Pendiente / No Asistió", value: "registered" },
      ]}
    />
  );
}