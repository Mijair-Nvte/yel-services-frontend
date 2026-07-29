"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getLinkColumns } from "./link-columns";
import { LinkEmpty } from "./link-empty";

export function LinkTable({
  links,
  onDelete,
  onEdit,
}: {
  links: any[];
  onDelete: (uid: string) => void;
  onEdit: (link: any) => void;
}) {
  const columns = useMemo(
    () => getLinkColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  if (links.length === 0) {
    return <LinkEmpty />;
  }

  return (
    <DataTable
      columns={columns}
      data={links}
    
    />
  );
}