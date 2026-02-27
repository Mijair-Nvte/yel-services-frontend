"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns"; // 🔥 IMPORTANTE
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { EVENT_COLORS, CalendarColorKey, DEFAULT_EVENT_COLOR } from "@/lib/calendar-colors";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react"; // Para el botón de borrar

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>; // 🔥 Añadido
  eventToEdit?: any | null; // 🔥 Añadido
  defaultDate?: Date;
}

export function EventDialog({ open, onOpenChange, onSubmit, onDelete, eventToEdit, defaultDate }: Props) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [color, setColor] = useState<CalendarColorKey>(DEFAULT_EVENT_COLOR);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isEditing = !!eventToEdit;

  // 🔥 EFECTO MAGICO: Rellena los datos cuando se abre el modal para editar
  useEffect(() => {
    if (open) {
      if (eventToEdit) {
        setTitle(eventToEdit.title);
        setDescription(eventToEdit.description || "");
        setLocation(eventToEdit.location || "");
        setMeetingUrl(eventToEdit.meeting_url || "");
        setIsAllDay(eventToEdit.is_all_day);
        setColor((eventToEdit.color as CalendarColorKey) || DEFAULT_EVENT_COLOR);
        
        // Formateo especial para el input type="datetime-local" (yyyy-MM-ddThh:mm)
        setStartDate(format(parseISO(eventToEdit.starts_at), "yyyy-MM-dd'T'HH:mm"));
        setEndDate(eventToEdit.ends_at ? format(parseISO(eventToEdit.ends_at), "yyyy-MM-dd'T'HH:mm") : "");
      } else {
        // Reset para Nuevo Evento
        setTitle("");
        setDescription("");
        setLocation("");
        setMeetingUrl("");
        setIsAllDay(false);
        setColor(DEFAULT_EVENT_COLOR);
        setStartDate(defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : "");
        setEndDate("");
      }
    }
  }, [open, eventToEdit, defaultDate]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    if (!startDate) {
      toast.error("Selecciona fecha de inicio");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title,
        description,
        location,
        color,
        meeting_url: meetingUrl || null,
        starts_at: new Date(startDate).toISOString(),
        ends_at: endDate ? new Date(endDate).toISOString() : null,
        is_all_day: isAllDay,
      });

      toast.success(isEditing ? "Evento actualizado ✏️" : "Evento creado 🎉");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Error guardando evento");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!onDelete) return;
    if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) return;
    
    try {
      setIsDeleting(true);
      await onDelete();
      toast.success("Evento eliminado 🗑️");
    } catch (error) {
      toast.error("Error eliminando el evento");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Evento" : "Nuevo Evento"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
           {/* ... TODOS TUS CAMPOS DEL FORMULARIO SE QUEDAN EXACTAMENTE IGUAL ... */}
           <div className="space-y-2">
            <Label>Título</Label>
            <Input placeholder="Ej: Seminario de inversión" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
             <Label>Color del evento</Label>
             <div className="flex gap-2">
                {(Object.keys(EVENT_COLORS) as CalendarColorKey[]).map((c) => (
                    <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                            "w-6 h-6 rounded-full transition-all ring-offset-2 ring-offset-background",
                            EVENT_COLORS[c].picker,
                            color === c ? "ring-2 scale-110" : "opacity-70 hover:opacity-100"
                        )}
                    />
                ))}
             </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea placeholder="Detalles del evento..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Modalidad</Label>
              <Input placeholder="Ej: En linea, presencial" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Link de reunión</Label>
              <Input placeholder="https://meet.google.com/..." value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label>Todo el día</Label>
            <Switch checked={isAllDay} onCheckedChange={setIsAllDay} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Inicio</Label>
              <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            {!isAllDay && (
              <div className="space-y-2">
                <Label>Fin</Label>
                <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between w-full">
          {isEditing && onDelete ? (
            <Button variant="destructive" size="icon" onClick={handleDeleteClick} disabled={loading || isDeleting}>
                <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
             <div /> // Espaciador para mantener el layout flex-between
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading || isDeleting}>
                Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading || isDeleting}>
                {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}