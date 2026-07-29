"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Usamos un genérico <TData> para que funcione con Usuarios, Ventas, Afiliados, etc.
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  onView?: (data: TData) => void;
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  onView,
}: DataTableRowActionsProps<TData>) {
  // Si no se pasó ninguna acción, no renderizamos nada
  if (!onEdit && !onDelete && !onView) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
        >
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs font-semibold uppercase text-slate-400">
          Acciones
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {onView && (
          <DropdownMenuItem
            onClick={() => onView(row.original)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-slate-500" />
            <span>Ver detalles</span>
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem
            onClick={() => onEdit(row.original)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-blue-500" />
            <span>Editar</span>
          </DropdownMenuItem>
        )}

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
