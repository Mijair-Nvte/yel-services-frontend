"use client";

import React, { useMemo } from "react";
import { OrgCustomer } from "@/services/org-customer/org-customer.service";
import { DataTable } from "@/components/ui/data-table";
import { getCustomerColumns } from "./customer-columns";

interface CustomerTableProps {
  customers: OrgCustomer[];
  onView: (customer: OrgCustomer) => void;
  onDelete: (uid: string) => void;
}

export function CustomerTable({ customers, onView, onDelete }: CustomerTableProps) {
  const columns = useMemo(
    () => getCustomerColumns({ onView, onDelete }),
    [onView, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={customers}
      // Opcional: Si luego quieres filtrar por source/tags, puedes agregarlo aquí
      // filterColumn="source" 
    />
  );
}