"use client";

import React, { useMemo } from "react";
import { LoanApplication } from "@/services/org-loan/org-loan.service";
import { DataTable } from "@/components/ui/data-table";
import { getLoanColumns } from "./loan-columns";

interface LoanTableProps {
  applications: LoanApplication[];
  onEdit: (application: LoanApplication) => void;
  onDelete: (uid: string) => void;
}

export function LoanTable({ applications, onEdit, onDelete }: LoanTableProps) {
  // Obtenemos las columnas inyectando las acciones
  const columns = useMemo(
    () => getLoanColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={applications}
      // Activamos el dropdown nativo de la DataTable para filtrar estatus
      filterColumn="status"
      filterOptions={[
        { label: "Pendientes", value: "pending" },
        { label: "En Revisión", value: "reviewing" },
        { label: "Aprobados", value: "approved" },
        { label: "Rechazados", value: "rejected" },
        { label: "Finalizados", value: "completed" },
      ]}
    />
  );
}