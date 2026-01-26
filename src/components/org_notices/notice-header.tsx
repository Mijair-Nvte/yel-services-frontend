// src/components/org_notices/notice-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NoticeHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Avisos y Comunicados</h1>
        <p className="text-sm text-muted-foreground">
          Centro de comunicación interna
        </p>
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Aviso
      </Button>
    </div>
  );
}
