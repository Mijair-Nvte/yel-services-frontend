
"use client";

import {
  Users,
  Briefcase,
  Building2,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function DepartmentCard({
  department,
  onClick,
  onEdit,
  onDelete,
}: {
  department: {
    uid: string;
    name: string;
    description?: string;
    members_count?: number;
    positions_count?: number;
    is_active?: boolean;
  };
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isActive = department.is_active !== false;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group p-6 cursor-pointer transition-all duration-300 border-2 border-transparent shadow-sm",
        "bg-blue-50/40 dark:bg-blue-950/10 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          {/* Icon Container */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50 transition-transform group-hover:scale-110">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Title + Status */}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-foreground leading-none tracking-tight">
              {department.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                Unidad Org.
              </span>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter",
                  isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Actions */}
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-200/50 dark:hover:bg-blue-900/50">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 shadow-xl border-border/50">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive cursor-pointer font-medium"
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed min-h-[40px]">
        {department.description || "No se ha proporcionado una descripción para este departamento."}
      </p>

      {/* Meta - Dividido por una línea sutil */}
      <div className="flex items-center gap-4 pt-4 border-t border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-border/50 shadow-xs">
          <Users className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-bold">{department.members_count ?? 0}</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase">Miembros</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-border/50 shadow-xs">
          <Briefcase className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-bold">{department.positions_count ?? 0}</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase">Puestos</span>
        </div>
      </div>
    </Card>
  );
}