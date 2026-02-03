"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Link2 } from "lucide-react";

export function LinkSheet({
  open,
  onClose,
  onSubmit,
  link,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  link?: any | null;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ Load edit data
  useEffect(() => {
    if (link) {
      setTitle(link.title ?? "");
      setUrl(link.url ?? "");
      setDescription(link.description ?? "");
    } else {
      setTitle("");
      setUrl("");
      setDescription("");
    }
  }, [link, open]);

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        title,
        url,
        description,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {link ? "Editar Link" : "Nuevo Link"}
          </DialogTitle>

          <DialogDescription>
            Agrega enlaces importantes para tu workspace.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Datos del enlace</FieldLegend>

              <FieldGroup>
                {/* TITLE */}
                <Field>
                  <FieldLabel>Título *</FieldLabel>
                  <Input
                    placeholder="Ej: Instagram oficial"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Field>

                {/* URL */}
                <Field>
                  <FieldLabel>URL *</FieldLabel>
                  <Input
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* DESCRIPTION */}
            <FieldSet>
              <FieldLegend>Descripción</FieldLegend>

              <FieldGroup>
                <Field>
                  <FieldLabel>Opcional</FieldLabel>
                  <Textarea
                    placeholder="Nota corta..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* ACTIONS */}
            <Field orientation="horizontal" className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Guardando..."
                  : link
                  ? "Actualizar"
                  : "Crear"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
