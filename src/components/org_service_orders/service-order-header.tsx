"use client";

import { ClipboardList } from "lucide-react";

interface ServiceOrderHeaderProps {
  onCreate?: () => void;
}

export function ServiceOrderHeader({ onCreate }: ServiceOrderHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-indigo-600" />
          Monitoreo de Servicios
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Gestiona el ciclo de vida de los trámites activos, asigna responsables
          y coordina el equipo de apoyo.
        </p>
      </div>
    </div>
  );
}
