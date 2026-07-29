"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getPartnerColumns } from "./partner-columns";

interface PartnerAdminTableProps {
  partners: any[];
  onView: (partner: any) => void;
}

export function PartnerAdminTable({ partners, onView }: PartnerAdminTableProps) {
  const columns = useMemo(() => getPartnerColumns({ onView }), [onView]);

  return (
    <DataTable
      columns={columns}
      data={partners}
     
      filterColumn="status"
      filterOptions={[
        { label: "Pendientes", value: "pending" },
        { label: "Aprobados", value: "approved" },
        { label: "Rechazados", value: "rejected" },
      ]}
    />
  );
}