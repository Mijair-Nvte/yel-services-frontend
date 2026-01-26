"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useDepartments } from "@/hooks/departments/use-departments";
import { DepartmentCard } from "@/components/department/department-card";
import { DepartmentSheet } from "@/components/department/department-sheet";
import { DepartmentService } from "@/services/department/department.service";

export default function DepartmentsPage() {
  const router = useRouter();
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { departments, reload } = useDepartments(workspaceUid);

  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Departamentos</h1>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo departamento
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dep) => (
          <DepartmentCard
            key={dep.uid}
            department={dep}
            onClick={() =>
              router.push(`/dashboard/${workspaceUid}/departments/${dep.uid}`)
            }
          />
        ))}
      </div>

      <DepartmentSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Create department"
        onSubmit={async (data) => {
          await DepartmentService.create(workspaceUid, data);
          reload();
        }}
      />
    </div>
  );
}
