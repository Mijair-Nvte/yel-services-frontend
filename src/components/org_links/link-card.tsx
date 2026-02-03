"use client";

import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Pencil,
  Copy,
  Link2,
} from "lucide-react";

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
      <div className="flex-1 space-y-2">
        {/* ✅ TITLE WITH ICON */}
        <div className="flex items-center gap-2">
          {/* ICON */}
          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Link2 className="h-4 w-4 text-blue-600" />
          </div>

          {/* TITLE */}
          <h3 className="font-semibold text-lg">{link.title}</h3>
        </div>

        {/* LINK BADGE */}
        <a
          href={link.url}
          target="_blank"
          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm text-blue-700 hover:bg-blue-100 transition"
        >
          <span className="max-w-[320px] truncate">
            {link.url}
          </span>

          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>

        {/* DESCRIPTION */}
        {link.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {link.description}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        {/* COPY */}
        <Button size="sm" variant="outline" onClick={handleCopy}>
          <Copy className="h-2 w-" />
        </Button>

        {/* EDIT */}
        <Button size="sm" variant="outline" onClick={onEdit}>
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
