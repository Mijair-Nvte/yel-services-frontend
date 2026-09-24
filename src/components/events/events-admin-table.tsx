"use client";

import React, { useMemo } from "react";
import { OrgEvent } from "@/services/events/org-event.service";
import { DataTable } from "@/components/ui/data-table";
import { getEventColumns } from "./events-columns";

interface EventsAdminTableProps {
  events: OrgEvent[];
  onEdit: (event: OrgEvent) => void;
  onDelete: (uid: string) => void;
  onView: (event: OrgEvent) => void;
}

export function EventsAdminTable({ events, onEdit, onDelete,onView }: EventsAdminTableProps) {
  const columns = useMemo(
    () => getEventColumns({ onEdit, onDelete,onView }),
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={events}
      // Opcional: Si quieres habilitar el filtro por el accessorFn "status"
      filterColumn="status"
      filterOptions={[
        { label: "Próximo", value: "Próximo" },
        { label: "Finalizado", value: "Finalizado" },
        { label: "Inactivo", value: "Inactivo" },
      ]}
    />
  );
}