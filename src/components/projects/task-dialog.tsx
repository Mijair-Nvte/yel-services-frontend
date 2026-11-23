"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { OrgProjectTask, SaveTaskDto } from "@/services/projects/org-task.service";
import { MarketingTaskFields } from "./tasks/marketing-task-fields";
import { EventsTaskFields } from "./tasks/events-task-fields";
import { TeamSelector } from "@/components/shared/team-selector";
import { Megaphone, Calendar, Briefcase, Settings } from "lucide-react";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SaveTaskDto) => Promise<void>;
  taskToEdit?: OrgProjectTask | null;
  members: any[];
  events?: any[];
}

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  taskToEdit,
  members = [],
  events = [],
}: Props) {
  const [loading, setLoading] = useState(false);

  // Campos principales
  const [department, setDepartment] = useState("marketing");
  const [platform, setPlatform] = useState("facebook");
  const [taskType, setTaskType] = useState("post");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [phase, setPhase] = useState("");
  const [isMilestone, setIsMilestone] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [notes, setNotes] = useState("");

  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Metadata para pautas
  const [budget, setBudget] = useState("");
  const [spent, setSpent] = useState("");
  const [leads, setLeads] = useState("");
  const [roas, setRoas] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const isEditing = !!taskToEdit;
  const isMarketing = department === "marketing";
  const isEvent = department === "eventos";

  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        setDepartment(taskToEdit.department || "marketing");
        setPlatform(taskToEdit.platform || "facebook");
        setTaskType(taskToEdit.task_type || "post");
        setName(taskToEdit.name);
        setDescription(taskToEdit.description || "");
        setPhase(taskToEdit.phase || "");
        setIsMilestone(taskToEdit.is_milestone || false);
        setStartDate(taskToEdit.start_date ? taskToEdit.start_date.substring(0, 10) : "");
        setEndDate(taskToEdit.end_date ? taskToEdit.end_date.substring(0, 10) : "");
        setStatus(taskToEdit.status || "in_progress");
        setSelectedEventId(taskToEdit.org_event_id ? String(taskToEdit.org_event_id) : "");

        if (taskToEdit.assigned_to) {
          setAssignedTo([String(taskToEdit.assigned_to)]);
        } else {
          setAssignedTo([]);
        }

        const meta = taskToEdit.metadata || {};
        setNotes(meta.notes || "");
        setBudget(meta.budget !== undefined ? String(meta.budget) : "");
        setSpent(meta.spent !== undefined ? String(meta.spent) : "");
        setLeads(meta.leads !== undefined ? String(meta.leads) : "");
        setRoas(meta.roas !== undefined ? String(meta.roas) : "");
        setTargetAudience(meta.target_audience || "");
      } else {
        setDepartment("marketing");
        setPlatform("facebook");
        setTaskType("post");
        setName("");
        setDescription("");
        setPhase("");
        setIsMilestone(false);
        setStartDate("");
        setEndDate("");
        setStatus("in_progress");
        setNotes("");
        setAssignedTo([]);
        setSelectedEventId("");
        setBudget("");
        setSpent("");
        setLeads("");
        setRoas("");
        setTargetAudience("");
      }
    }
  }, [open, taskToEdit]);

  const handleSelectEvent = (event: any) => {
    if (event) {
      setName(event.title || "");
      setDescription(event.description || "");
      if (event.starts_at) {
        setStartDate(event.starts_at.substring(0, 10));
      }
      if (event.ends_at) {
        setEndDate(event.ends_at.substring(0, 10));
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("El nombre de la tarea es obligatorio");
      return;
    }

    try {
      setLoading(true);

      const payload: SaveTaskDto = {
        name,
        description,
        department,
        platform: isMarketing ? platform : undefined,
        task_type: isMarketing ? taskType : undefined,
        phase: phase || undefined,
        is_milestone: isMilestone,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        status,
        assigned_to: assignedTo.length > 0 ? Number(assignedTo[0]) : null,
        org_event_id: selectedEventId ? Number(selectedEventId) : null,
        metadata: {
          notes,
          assigned_users: assignedTo,
          ...(isMarketing
            ? {
              budget: budget ? parseFloat(budget) : null,
              spent: spent ? parseFloat(spent) : null,
              leads: leads ? parseInt(leads) : null,
              roas: roas ? parseFloat(roas) : null,
              target_audience: targetAudience,
            }
            : {}),
        },
      };

      await onSubmit(payload);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Error al guardar la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-0 p-0 overflow-hidden">
        {/* Encabezado fijo */}
        <DialogHeader className="border-b border-border/60 bg-muted/20 px-6 py-4 text-left">
          <DialogTitle className="text-base font-semibold tracking-tight">
            {isEditing ? "Editar Tarea" : "Nueva Tarea de Proyecto"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Modifica los detalles, plazos y responsables de la tarea."
              : "Registra una nueva actividad para el equipo y asigna los recursos necesarios."}
          </DialogDescription>
        </DialogHeader>

        {/* Contenido con scroll interno */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">

          {/* Bloque 1: Información Principal */}
          <div className="space-y-4 rounded-xl border border-border/60 bg-card p-4 shadow-2xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre de la Tarea</Label>
              <Input
                placeholder="Ej: Campaña Leads Noviembre - Facebook Ads"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Departamento</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona departamento..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-primary" />
                        <span>Marketing Digital</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="eventos">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-violet-500" />
                        <span>Eventos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ventas">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-emerald-500" />
                        <span>Ventas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="operaciones">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>Operaciones</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estatus</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona estatus..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
                        <span>Pendiente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>En Proceso</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="review">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>En Revisión</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Completada</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles / Entregable</Label>
              <Textarea
                placeholder="Describe brevemente los entregables o instrucciones..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          {/* Bloque 2: Campos Específicos (Marketing o Eventos) */}
          {(isMarketing || isEvent) && (
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 shadow-2xs">
              {isMarketing && (
                <MarketingTaskFields
                  platform={platform}
                  setPlatform={setPlatform}
                  taskType={taskType}
                  setTaskType={setTaskType}
                  budget={budget}
                  setBudget={setBudget}
                  spent={spent}
                  setSpent={setSpent}
                  leads={leads}
                  setLeads={setLeads}
                  roas={roas}
                  setRoas={setRoas}
                  targetAudience={targetAudience}
                  setTargetAudience={setTargetAudience}
                />
              )}

              {isEvent && (
                <EventsTaskFields
                  events={events}
                  selectedEventId={selectedEventId}
                  setSelectedEventId={setSelectedEventId}
                  onSelectEvent={handleSelectEvent}
                />
              )}
            </div>
          )}

          {/* Bloque 3: Planeación, Fechas y Responsables */}
          <div className="space-y-4 rounded-xl border border-border/60 bg-card p-4 shadow-2xs">
            <TeamSelector
              label="Responsables"
              members={members}
              value={assignedTo}
              onChange={setAssignedTo}
              multiple={true}
              placeholder="Selecciona responsables..."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fase del Proyecto</Label>
                <Select value={phase} onValueChange={setPhase}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="General (sin fase)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fase_0">Fase 0 · Arranque</SelectItem>
                    <SelectItem value="fase_1">Fase 1 · Fundamentos</SelectItem>
                    <SelectItem value="fase_2">Fase 2 · Lanzamiento visual</SelectItem>
                    <SelectItem value="fase_3">Fase 3 · Comunicación y sistemas</SelectItem>
                    <SelectItem value="fase_4">Fase 4 · Consolidación y medición</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inicio</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fin</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox de Hito */}
            <div className="flex items-center space-x-3 rounded-lg border border-border/40 bg-background px-3 py-2.5">
              <Checkbox
                id="milestone"
                checked={isMilestone}
                onCheckedChange={(checked) => setIsMilestone(checked === true)}
              />
              <div className="flex flex-col">
                <label htmlFor="milestone" className="cursor-pointer text-xs font-medium text-foreground">
                  Marcar como hito importante
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Se destacará visualmente en el panel de hitos del proyecto.
                </span>
              </div>
            </div>
          </div>

          {/* Bloque 4: Notas adicionales */}
          <div className="space-y-2 rounded-xl border border-border/60 bg-card p-4 shadow-2xs">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notas u Observaciones</Label>
            <Textarea
              placeholder="Agrega enlaces, cambios o pendientes relevantes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none text-xs"
            />
          </div>

        </div>

        {/* Pie fijo con acciones */}
        <DialogFooter className="flex-row items-center justify-end gap-2 border-t border-border/60 bg-muted/20 px-6 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar Tarea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}