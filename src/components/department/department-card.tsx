"use client";

import {
  Users,
  Briefcase,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DepartmentCard({
  department,
  onClick,
}: {
  department: {
    name: string;
    description?: string;
    members_count?: number;
    positions_count?: number;
    status?: "active" | "inactive";
  };
  onClick: () => void;
}) {
  const isActive = department.status !== "inactive";

  return (
    <Card
      onClick={onClick}
      className="card-interactive p-6 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>

          {/* Title + Status */}
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-foreground leading-none">
              {department.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Departamento
              </span>

              {/* Status badge */}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">
        {department.description || "Sin descripción"}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{department.members_count ?? 0} personas</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{department.positions_count ?? 0} puestos</span>
        </div>
      </div>
    </Card>
  );
}
