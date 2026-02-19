"use client";

import { Separator } from "@/components/ui/separator";

export function AccountHeader() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configuración de cuenta
        </h1>
        <p className="text-sm text-muted-foreground">
          Administra tu información personal y preferencias.
        </p>
      </div>

      <Separator />
    </div>
  );
}
