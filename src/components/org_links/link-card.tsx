"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Copy } from "lucide-react";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { toast } from "sonner";

export function LinkCard({
  link,
  onDelete,
  onEdit,
}: {
  link: any;
  onDelete?: (uid: string) => void;
  onEdit?: () => void;
}) {
  // ✅ COPY FUNCTION
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link.url);

    toast.success("Link copiado", {
      description: "Ya puedes pegarlo donde quieras.",
    });
  };

  return (
    <div className="border rounded-xl p-4 flex justify-between items-start gap-4">
      {/* INFO */}
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{link.title}</h3>

        <a
          href={link.url}
          target="_blank"
          className="text-sm text-blue-600 underline flex items-center gap-1"
        >
          {link.url}
          <ExternalLink className="h-3 w-3" />
        </a>

        {link.description && (
          <p className="text-sm text-muted-foreground">
            {link.description}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        {/* COPY */}
        <Button size="icon" variant="outline" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>

        {/* EDIT */}
        <Button size="icon" variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>

        {/* DELETE */}
        <ConfirmDeleteDialog
          title="Eliminar enlace"
          description={`¿Seguro que quieres eliminar "${link.title}"?`}
          onConfirm={() => onDelete?.(link.uid)}
        />
      </div>
    </div>
  );
}
