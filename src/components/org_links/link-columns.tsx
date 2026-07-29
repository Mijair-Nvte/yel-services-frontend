"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { Button } from "@/components/ui/button";

interface LinkColumnProps {
  onEdit: (link: any) => void;
  onDelete: (uid: string) => void;
}

export const getLinkColumns = ({ onEdit, onDelete }: LinkColumnProps): ColumnDef<any>[] => [
  {
    accessorKey: "title",
    header: "Título",
    // Para que el buscador global encuentre también por la descripción
    accessorFn: (row) => `${row.title} ${row.description || ""}`,
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-semibold text-slate-900">{row.original.title}</div>
          {row.original.description && (
            <div className="text-xs text-slate-500 line-clamp-1 max-w-[300px]">
              {row.original.description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: "Enlace",
    cell: ({ row }) => {
      const handleCopy = async () => {
        await navigator.clipboard.writeText(row.original.url);
        toast.success("Enlace copiado", {
          description: "Ya puedes pegarlo donde quieras.",
        });
      };

      return (
        <div className="flex items-center gap-2">
          <a
            href={row.original.url}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm text-blue-700 hover:bg-blue-100 transition"
          >
            <span className="max-w-[200px] truncate">{row.original.url}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7 text-slate-400 hover:text-slate-900">
            <Copy className="h-3.5 w-3.5" />
          </Button>
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