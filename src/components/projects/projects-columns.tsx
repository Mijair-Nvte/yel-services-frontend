"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OrgProject } from "@/services/projects/org-project.service";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { Eye, CheckCircle2, ListTodo, CalendarClock } from "lucide-react";
import { Button } from "../ui/button";

interface ProjectColumnProps {
  onEdit: (project: OrgProject) => void;
  onDelete: (uid: string) => void;
  onView: (project: OrgProject) => void;
}

export const getProjectColumns = ({ onEdit, onDelete, onView }: ProjectColumnProps): ColumnDef<OrgProject>[] => [
  {
    id: "name",
    header: "Proyecto",
    accessorFn: (row) => row.name,
    cell: ({ row }) => {
      const proj = row.original;
      return (
        <div 
          className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer transition-colors max-w-[300px] truncate"
          onClick={() => onView(proj)}
          title={proj.name}
        >
          {proj.name}
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Fechas",
    cell: ({ row }) => {
      const startDate = row.original.start_date ? new Date(row.original.start_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : "Sin inicio";
      const endDate = row.original.end_date ? new Date(row.original.end_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : "Sin fin";
      
      return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarClock className="h-4 w-4 text-slate-400" />
          <span>{startDate} - {endDate}</span>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Estatus",
    accessorFn: (row) => row.status,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        draft: { label: "Borrador", style: "bg-slate-100 text-slate-600" },
        active: { label: "Activo", style: "bg-emerald-100 text-emerald-800" },
        completed: { label: "Completado", style: "bg-blue-100 text-blue-800" },
        archived: { label: "Archivado", style: "bg-rose-100 text-rose-800" },
      };

      const current = statusConfig[status] || statusConfig.draft;

      return <Badge className={`${current.style} border-none shadow-none`}>{current.label}</Badge>;
    },
  },
  {
    accessorKey: "tasks_count",
    header: "Tareas",
    cell: ({ row }) => {
      const count = row.original.tasks_count || 0;
      return (
        <div className="flex items-center gap-1.5">
          <ListTodo className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-bold text-indigo-700">{count}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Acciones</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-indigo-600"
            onClick={() => onView(row.original)}
            title="Ver detalles del proyecto"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DataTableRowActions
            row={row}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original.uid)}
          />
        </div>
      );
    },
  },
];