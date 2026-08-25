"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InsureceSettingsTab({ workspaceUid }: { workspaceUid: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Configuración de Préstamos</CardTitle>
          <CardDescription>Administra las tasas, plazos y parámetros de préstamos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">
            Módulo de préstamos en construcción...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}