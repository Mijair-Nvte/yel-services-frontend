"use client";

import React, { useMemo } from "react";
import { OrgProject } from "@/services/projects/org-project.service";
import { DataTable } from "@/components/ui/data-table";
import { getProjectColumns } from "./projects-columns";

interface ProjectsAdminTableProps {
  projects: OrgProject[];
  onEdit: (project: OrgProject) => void;
  onDelete: (uid: string) => void;
  onView: (project: OrgProject) => void;
}

export function ProjectsAdminTable({ projects, onEdit, onDelete, onView }: ProjectsAdminTableProps) {
  const columns = useMemo(
    () => getProjectColumns({ onEdit, onDelete, onView }),
    [onEdit, onDelete, onView]
  );

  return (
    <DataTable
      columns={columns}
      data={projects}
      filterColumn="status"
      filterOptions={[
        { label: "Borrador", value: "draft" },
        { label: "Activo", value: "active" },
        { label: "Completado", value: "completed" },
        { label: "Archivado", value: "archived" },
      ]}
    />
  );
}