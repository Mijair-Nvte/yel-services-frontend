"use client";

import { useState } from "react";
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
import { Trash2Icon, Loader2 } from "lucide-react";

export function ConfirmDeleteDialog({
  title = "Eliminar elemento",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirm,
  trigger,
}: {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<boolean | void> | void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que se cierre antes de completar la llamada a la API
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="destructive">
            <Trash2Icon className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>

      {/* MODAL - Se asigna z-[100] para quedar siempre encima de ResourceManagerModal */}
      <AlertDialogContent className="max-w-sm rounded-xl z-[100]">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon className="h-5 w-5" />
          </AlertDialogMedia>

          <AlertDialogTitle className="text-lg font-semibold">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel variant="outline" disabled={loading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}