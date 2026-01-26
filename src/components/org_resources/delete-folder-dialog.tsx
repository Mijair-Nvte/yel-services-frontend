// src/components/org_resources/delete-folder-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function DeleteFolderDialog({
  folder,
  onDelete,
}: {
  folder: any;
  onDelete: (folder: any) => Promise<void>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar carpeta</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          ¿Seguro que deseas eliminar la carpeta <strong>{folder.name}</strong>?
          <br />
          <span className="text-red-500 font-medium">
            Esta acción eliminará todo su contenido.
          </span>
        </p>

        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive" onClick={() => onDelete(folder)}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
