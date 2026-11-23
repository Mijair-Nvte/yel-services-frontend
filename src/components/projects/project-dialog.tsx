"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CreateProjectDto, OrgProject } from "@/services/projects/org-project.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProjectDto) => Promise<void>;
  onDelete?: () => Promise<void>;
  projectToEdit?: OrgProject | null;
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  projectToEdit,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("draft");
  const isEditing = !!projectToEdit;

  useEffect(() => {
    if (open) {
      if (projectToEdit) {
        setName(projectToEdit.name);
        setDescription(projectToEdit.description || "");
        setStartDate(projectToEdit.start_date ? projectToEdit.start_date.substring(0, 10) : "");
        setEndDate(projectToEdit.end_date ? projectToEdit.end_date.substring(0, 10) : "");
        setStatus(projectToEdit.status || "draft");
      } else {
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setStatus("draft");
      }
    }
  }, [open, projectToEdit]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("El nombre del proyecto es obligatorio");
      return;
    }

    try {
      setLoading(true);
      
      const payload: CreateProjectDto = {
        name,
        description,
        status,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      };

      await onSubmit(payload);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Error guardando proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}
          </SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar overflow-y-auto px-1 py-6 space-y-4">
          <div className="space-y-2">
            <Label>Nombre del Proyecto</Label>
            <Input
              placeholder="Ej: Planificación de Campañas Q4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              placeholder="Objetivos y detalles del proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Fin</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estatus</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">📝 Borrador</SelectItem>
                <SelectItem value="active">🟢 Activo</SelectItem>
                <SelectItem value="completed">✅ Completado</SelectItem>
                <SelectItem value="archived">📦 Archivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || isDeleting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || isDeleting}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}