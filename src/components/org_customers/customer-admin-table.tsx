"use client";

import React, { useMemo } from "react";
import { OrgCustomer } from "@/services/org-customer/org-customer.service";
import { DataTable } from "@/components/ui/data-table";
import { getCustomerColumns } from "./customer-columns";
import { PaginationState, OnChangeFn } from "@tanstack/react-table"; 

interface CustomerTableProps {
  customers: OrgCustomer[];
  onView: (customer: OrgCustomer) => void;
  onDelete: (uid: string) => void;

  meta?: any;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
}

export function CustomerTable({ 
  customers,
  meta,
  pagination,
  onPaginationChange, 
  onView, 
  onDelete 
}: CustomerTableProps) {
  
  const columns = useMemo(
    () => getCustomerColumns({ onView, onDelete }),
    [onView, onDelete]
  );

  return (
    <DataTable 
      columns={columns} 
      data={customers} 
      manualPagination={true}
      pageCount={meta?.last_page ?? -1} 
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  );
}