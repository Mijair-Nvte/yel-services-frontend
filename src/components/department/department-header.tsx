"use client";

import { Badge } from "@/components/ui/badge";

export function DepartmentHeader({ department }: { department: any }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{department.name}</h1>

      {department.description && (
        <p className="text-muted-foreground">
          {department.description}
        </p>
      )}

      {!department.is_active && (
        <Badge variant="destructive">Inactive</Badge>
      )}
    </div>
  );
}
