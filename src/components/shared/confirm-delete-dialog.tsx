"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export function ConfirmDeleteDialog({
  title = "Eliminar elemento",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirm,
}: {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      {/* TRIGGER */}
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      {/* MODAL */}
      <AlertDialogContent className="max-w-sm rounded-xl">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle className="text-lg font-semibold">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel variant="outline">
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
