"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import { useDepartments } from "@/hooks/departments/use-departments";
import { DepartmentCard } from "@/components/department/department-card";
import { DepartmentDialog } from "@/components/department/department-dialog";
import { DepartmentService } from "@/services/department/department.service";

export default function DepartmentsPage() {
  const router = useRouter();
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { departments, reload } = useDepartments(workspaceUid);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Departamentos</h1>

        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo departamento
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dep) => (
          <DepartmentCard
            key={dep.uid}
            department={dep}
            onClick={() =>
              router.push(
                `/dashboard/${workspaceUid}/departments/${dep.uid}`
              )
            }
            onEdit={() => {
              setEditing(dep);
              setOpen(true);
            }}
            onDelete={async () => {
              const confirmed = confirm(
                `¿Seguro que deseas eliminar el departamento "${dep.name}"?`
              );

              if (!confirmed) return;

              await DepartmentService.delete(dep.uid);
              reload();
            }}
          />
        ))}
      </div>

      {/* Dialog (Create / Edit) */}
      <DepartmentDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        title={editing ? "Editar departamento" : "Crear departamento"}
        initialData={editing}
        onSubmit={async (data) => {
          if (editing) {
            await DepartmentService.update(editing.uid, data);
          } else {
            await DepartmentService.create(workspaceUid, data);
          }
          reload();
        }}
      />
    </div>
  );
}
