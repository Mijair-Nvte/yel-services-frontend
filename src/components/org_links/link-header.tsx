"use client";

import { Button } from "@/components/ui/button";
import { Plus, Link2 } from "lucide-react";

export function LinkHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Link2 className="h-6 w-6" />
          Enlaces de la Empresa
        </h1>

        <p className="text-sm text-muted-foreground">
          Gestiona links importantes como redes sociales, documentos o tiendas.
        </p>
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Link
      </Button>
    </div>
  );
}
