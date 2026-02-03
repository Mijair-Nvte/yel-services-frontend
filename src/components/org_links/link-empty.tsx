"use client";

import { Link2 } from "lucide-react";

export function LinkEmpty() {
  return (
    <div className="border rounded-xl p-10 text-center space-y-3">
      <Link2 className="mx-auto h-10 w-10 text-muted-foreground" />

      <h3 className="text-lg font-semibold">
        No hay enlaces todavía
      </h3>

      <p className="text-sm text-muted-foreground">
        Crea tu primer link para que el equipo tenga acceso rápido.
      </p>
    </div>
  );
}
