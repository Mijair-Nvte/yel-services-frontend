"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getServiceColumns } from "./service-columns";

export function ServicesGrid({ services, onEdit, onDelete }: any) {
  const columns = useMemo(() => getServiceColumns({ onEdit, onDelete }), [onEdit, onDelete]);

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
        <p className="text-slate-400 font-medium">
          No se encontraron servicios o productos.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={services}
     filterColumn="is_active"
      filterOptions={[
        { label: "Activos", value: "active" },
        { label: "Inactivos", value: "inactive" },
      ]}
    />
  );
}