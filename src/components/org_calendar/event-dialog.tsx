"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  EVENT_COLORS,
  CalendarColorKey,
  DEFAULT_EVENT_COLOR,
} from "@/lib/calendar-colors";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react"; // Para el botón de borrar
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageUploader } from "@/components/ui/image-uploader";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  eventToEdit?: any | null;
  defaultDate?: Date;
}

export function EventDialog({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  eventToEdit,
  defaultDate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [color, setColor] = useState<CalendarColorKey>(DEFAULT_EVENT_COLOR);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("yel_services");
  const isEditing = !!eventToEdit;

  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | string | null>(null);

  // 🔥 EFECTO MAGICO: Rellena los datos cuando se abre el modal para editar
  useEffect(() => {
    if (open) {
      if (eventToEdit) {
        setTitle(eventToEdit.title);
        setDescription(eventToEdit.description || "");
        setLocation(eventToEdit.location || "");
        setMeetingUrl(eventToEdit.meeting_url || "");
        setExternalUrl(eventToEdit.external_url || "");
        setIsAllDay(eventToEdit.is_all_day);
        setTargetPlatform(eventToEdit.target_platform || "yel_services");
        setColor(
          (eventToEdit.color as CalendarColorKey) || DEFAULT_EVENT_COLOR,
        );

        // Formateo especial para el input type="datetime-local" (yyyy-MM-ddThh:mm)
        setStartDate(
          format(parseISO(eventToEdit.starts_at), "yyyy-MM-dd'T'HH:mm"),
        );
        setEndDate(
          eventToEdit.ends_at
            ? format(parseISO(eventToEdit.ends_at), "yyyy-MM-dd'T'HH:mm")
            : "",
        );

        setCoverImage(eventToEdit.cover_image_url || null);
        setBannerImage(eventToEdit.banner_image_url || null);
      } else {

        setTitle("");
        setDescription("");
        setLocation("");
        setMeetingUrl("");
        setExternalUrl("");
        setIsAllDay(false);
        setColor(DEFAULT_EVENT_COLOR);
        setTargetPlatform("yel_services");
        setStartDate(
          defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : "",
        );
        setEndDate("");
        setCoverImage(null);
        setBannerImage(null);
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

    
      const payload = new FormData();

      payload.append("title", title);
      payload.append("description", description);
      payload.append("location", location);
      payload.append("color", color);
      payload.append("target_platform", targetPlatform);
      if (meetingUrl) payload.append("meeting_url", meetingUrl);
      if (externalUrl) payload.append("external_url", externalUrl);
      payload.append("starts_at", new Date(startDate).toISOString());
      if (endDate && !isAllDay) payload.append("ends_at", new Date(endDate).toISOString());
      payload.append("is_all_day", isAllDay ? "1" : "0");

     
      if (coverImage instanceof File) {
        payload.append("cover_image", coverImage);
      }
      if (bannerImage instanceof File) {
        payload.append("banner_image", bannerImage);
      }

   
      if (isEditing) {
        payload.append("_method", "PUT");
      }

      // Enviamos el FormData
      await onSubmit(payload);

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
          <DialogTitle>
            {isEditing ? "Editar Evento" : "Nuevo Evento"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
         <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <ImageUploader
                label="Portada (Cuadrada)"
                description="Ideal: 800x800px"
                value={coverImage}
                onChange={(file) => setCoverImage(file)}
              />
            </div>
            <div className="space-y-2">
              <ImageUploader
                label="Banner (Horizontal)"
                description="Ideal: 1200x600px"
                value={bannerImage}
                onChange={(file) => setBannerImage(file)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              placeholder="Ej: Seminario de inversión"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                    color === c
                      ? "ring-2 scale-110"
                      : "opacity-70 hover:opacity-100",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              placeholder="Detalles del evento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Modalidad</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En línea">En línea</SelectItem>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Link de reunión</Label>
              <Input
                placeholder="https://meet.google.com/..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Link Registro</Label>
              <Input
                placeholder="https://tusitio.com/evento"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label>Todo el día</Label>
            <Switch checked={isAllDay} onCheckedChange={setIsAllDay} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Inicio</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {!isAllDay && (
              <div className="space-y-2">
                <Label>Fin</Label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Plataforma donde se mostrará</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
            >
              <option value="yel_services">Yel Services (Central)</option>
              <option value="yel_pro">Yel Pro</option>
              <option value="yel_investor">Yel Investor</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between w-full">
          {isEditing && onDelete ? (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteClick}
              disabled={loading || isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <div /> // Espaciador para mantener el layout flex-between
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || isDeleting}
            >
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
