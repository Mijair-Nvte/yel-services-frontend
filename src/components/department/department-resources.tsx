"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DepartmentResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursos</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground">
        Próximamente: archivos, PDFs, links y recursos del departamento.
      </CardContent>
    </Card>
  );
}
