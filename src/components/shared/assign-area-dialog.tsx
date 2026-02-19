"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DepartmentService } from "@/services/org_department/org-area.service";
import { OrgAssignmentService } from "@/services/org_assignment/org-assignment.service";
import { usePositions } from "@/hooks/org_position/use-positions";

export function AssignAreaDialog({
  workspaceUid,
  userId,
  open,
  onOpenChange,
  onSuccess,
}: {
  workspaceUid: string;
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [areas, setAreas] = useState<any[]>([]);
  const [areaId, setAreaId] = useState<string>();
  const [positionId, setPositionId] = useState<string>();
  const [loading, setLoading] = useState(false);

  // 🔥 Hook profesional para posiciones
  const { positions, loading: loadingPositions } =
    usePositions(workspaceUid, open);

  // 🔥 Cargar áreas cuando abre
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        const data = await DepartmentService.list(workspaceUid);
        setAreas(data);
      } catch {
        toast.error("Error cargando áreas");
      }
    };

    load();
  }, [open, workspaceUid]);

  // 🔥 Resetear estado al cerrar
  useEffect(() => {
    if (!open) {
      setAreaId(undefined);
      setPositionId(undefined);
      setLoading(false);
    }
  }, [open]);

  const handleAssign = async () => {
    if (!areaId || !positionId) {
      toast.error("Selecciona área y puesto");
      return;
    }

    try {
      setLoading(true);

      await OrgAssignmentService.assign({
        user_id: userId,
        org_area_id: Number(areaId),
        org_role_id: Number(positionId),
      });

      toast.success("Usuario asignado correctamente 🚀");

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Error al asignar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar a departamento</DialogTitle>
        </DialogHeader>

        <div className=" space-y-6 py-4">
          {/* Área */}
          <div className="space-y-2 gap-3 ">
            <label className="text-sm font-medium">
              Departamento
            </label>

            <Select value={areaId} onValueChange={setAreaId}>
           <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar área" />
              </SelectTrigger>
              <SelectContent className="">
                {areas.map((area) => (
                  <SelectItem key={area.id} value={String(area.id)}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Puesto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Puesto
            </label>

            <Select value={positionId} onValueChange={setPositionId}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingPositions
                      ? "Cargando puestos..."
                      : "Seleccionar puesto"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={String(position.id)}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleAssign}
            disabled={!areaId || !positionId || loading}
          >
            {loading ? "Asignando..." : "Asignar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
