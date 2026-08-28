"use client";

import React, { useMemo } from "react";
import { InsuranceApplication } from "@/services/insurance/org-insurance.service";
import { DataTable } from "@/components/ui/data-table";
import { getInsuranceColumns } from "./insurance-columns";

interface InsuranceAdminTableProps {
  applications: InsuranceApplication[];
  onEdit: (application: InsuranceApplication) => void;
  onDelete: (uid: string) => void;
}

export function InsuranceAdminTable({ applications, onEdit, onDelete }: InsuranceAdminTableProps) {
  // Obtenemos las columnas inyectando las acciones para que DataTableRowActions pueda usarlas
  const columns = useMemo(
    () => getInsuranceColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={applications}
      // Activamos el dropdown nativo de tu DataTable para filtrar estatus
      filterColumn="status"
      filterOptions={[
        { label: "Open", value: "Open" },
        { label: "Lost", value: "Lost" },
        { label: "Won", value: "Won" },
        { label: "Abandon", value: "Abandon" },
      ]}
    />
  );
}