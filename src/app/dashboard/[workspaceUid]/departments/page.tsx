
"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { useState } from "react";

import { useDepartments } from "@/hooks/departments/use-departments";
import { DepartmentCard } from "@/components/department/department-card";
import { DepartmentDialog } from "@/components/department/department-dialog";
import { DepartmentService } from "@/services/org_department/org-area.service";

export default function DepartmentsPage() {
  const router = useRouter();
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { departments, reload } = useDepartments(workspaceUid);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6">
      {/* Header - Limpio y con elevación visual */}
      <div className="flex items-center justify-between border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Departamentos</h1>
        </div>

        <Button
          className="shadow-md hover:shadow-primary/20 transition-all font-semibold"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
          Nuevo departamento
        </Button>
      </div>

      {/* Grid con espaciado mejorado */}
      {departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-border/60 bg-muted/20">
          <p className="text-muted-foreground font-medium">No se encontraron departamentos</p>
          <Button variant="ghost" className="mt-2 text-primary" onClick={() => setOpen(true)}>
            Click aquí para crear uno
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dep) => (
            <div key={dep.uid} className="transition-transform duration-300 hover:-translate-y-1">
              <DepartmentCard
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

                  await DepartmentService.delete(workspaceUid, dep.uid);
                  reload();
                }}
              />
            </div>
          ))}
        </div>
      )}

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
            await DepartmentService.update(workspaceUid,editing.uid, data);
          } else {
            await DepartmentService.create(workspaceUid, data);
          }
          reload();
        }}
      />
    </div>
  );
}