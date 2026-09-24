"use client";

import React, { useMemo } from "react";
import { EventRegistration } from "@/services/events/org-event.service";
import { DataTable } from "@/components/ui/data-table";
import { getAttendeesColumns } from "./attendees-columns";

interface AttendeesTableProps {
  registrations: EventRegistration[];
}

export function AttendeesTable({ registrations }: AttendeesTableProps) {
  const columns = useMemo(() => getAttendeesColumns(), []);

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