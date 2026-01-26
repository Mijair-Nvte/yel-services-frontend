"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NoticeSheet({
  open,
  onClose,
  onSubmit,
  notice,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  notice?: any | null;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [level, setLevel] = useState("info");
  const [loading, setLoading] = useState(false);

  // 🧠 Cargar datos cuando es edición
  useEffect(() => {
    if (notice) {
      setTitle(notice.title ?? "");
      setBody(notice.body ?? "");
      setLevel(notice.level ?? "info");
    } else {
      // Reset cuando es nuevo
      setTitle("");
      setBody("");
      setLevel("info");
    }
  }, [notice, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, body, level });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {notice ? "Editar aviso" : "Crear nuevo aviso"}
          </DialogTitle>
          <DialogDescription>
            {notice
              ? "Actualiza la información del aviso"
              : "Completa el formulario para publicar un aviso interno"}
          </DialogDescription>
        </DialogHeader>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* TÍTULO */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del aviso *</Label>
            <Input
              id="title"
              placeholder="Ej: Actualización del sistema"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* CONTENIDO */}
          <div className="space-y-2">
            <Label htmlFor="body">Contenido *</Label>
            <Textarea
              id="body"
              placeholder="Escribe el contenido del aviso..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* NIVEL */}
          <div className="space-y-2">
            <Label>Nivel del aviso</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Informativo</SelectItem>
                <SelectItem value="warning">Advertencia</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FOOTER */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : notice
                  ? "Actualizar aviso"
                  : "Publicar aviso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
