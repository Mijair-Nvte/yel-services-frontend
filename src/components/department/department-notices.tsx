"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DepartmentNotices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avisos</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground">
        Próximamente: avisos internos del departamento.
      </CardContent>
    </Card>
  );
}
