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
import { OrgNoticeService } from "@/services/org_notices/org-notice.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

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

  const [isPinned, setIsPinned] = useState(false);

  const [levels, setLevels] = useState<any[]>([]);
  const [noticeLevelId, setNoticeLevelId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLevels() {
      try {
        const data = await OrgNoticeService.levels();
        setLevels(data);

        if (!notice && data.length > 0) {
          setNoticeLevelId(String(data[0].id));
        }
      } catch (err) {
        console.error("Error cargando niveles", err);
      }
    }

    loadLevels();
  }, [notice]);

  useEffect(() => {
    if (notice) {
      setTitle(notice.title ?? "");
      setBody(notice.body ?? "");
      setNoticeLevelId(String(notice.notice_level_id));

      setIsPinned(notice.is_pinned ?? false);
    } else {
      setTitle("");
      setBody("");
      setLevel("info");
      setIsPinned(false);
    }
  }, [notice, open]);

  // ✅ SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        title,
        body,
        notice_level_id: Number(noticeLevelId),

        is_pinned: isPinned,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };
  const selectedLevel = levels.find((lvl) => String(lvl.id) === noticeLevelId);

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

            <Select value={noticeLevelId} onValueChange={setNoticeLevelId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel">
                  {selectedLevel && (
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: selectedLevel.color }}
                      />
                      <span>{selectedLevel.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {levels.map((lvl) => (
                  <SelectItem key={lvl.id} value={String(lvl.id)}>
                    <div className="flex items-center justify-between w-full">
                      <span
                        className="px-2 py-0.5 rounded-md text-xs font-medium text-white"
                        style={{ backgroundColor: lvl.color }}
                      >
                        {lvl.name.toUpperCase()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ NUEVO: PIN SWITCH */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">
                {isPinned ? "Aviso fijado 📌" : "Fijar este aviso"}
              </p>
              <p className="text-sm text-muted-foreground">
                Los avisos fijados aparecen siempre arriba en el dashboard.
              </p>
            </div>

            <Switch checked={isPinned} onCheckedChange={setIsPinned} />
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
