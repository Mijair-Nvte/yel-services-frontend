"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DepartmentDialog({
  open,
  onClose,
  title,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: {
    name: string;
    description?: string;
  }) => void;
  initialData?: {
    name?: string;
    description?: string;
  };
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 🧠 Sync data when editing
  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setDescription(initialData?.description ?? "");
    }
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, description });
            onClose();
          }}
        >
          <Input
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
