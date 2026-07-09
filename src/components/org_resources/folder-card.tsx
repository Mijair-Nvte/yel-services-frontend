// src/components/org_resources/folder-card.tsx
"use client";

import { Folder, MoreVertical, Pencil, Trash, Share2 } from "lucide-react";
import { FolderDialog } from "./folder-dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export function FolderCard({
  folder,
  onOpen,
  onRename,
  onDelete,
  onShare,
}: {
  folder: any;
  onOpen: () => void;
  onRename: (folder: any, name: string) => Promise<void>;
  onDelete: (folder: any) => Promise<void>;
  onShare: (folder: any, platform: string) => Promise<void>;
}) {
  return (
    <div
      className="
        flex items-center justify-between
        px-4 py-3 rounded-xl
        border bg-background
        hover:bg-muted/60
        transition cursor-pointer
        group
      "
    >
      {/* Folder main */}
      <div onClick={onOpen} className="flex items-center gap-3 flex-1">
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
          <Folder className="h-5 w-5 text-blue-600" />
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-sm">{folder.name}</span>
          <span className="text-xs text-muted-foreground">Carpeta</span>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {/* RENOMBRAR */}
          <FolderDialog
            title="Renombrar carpeta"
            initialName={folder.name}
            onSubmit={(name) => onRename(folder, name)}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="h-4 w-4 mr-2" />
                Renombrar
              </DropdownMenuItem>
            }
          />
         <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // Evita que se cierre el menú abruptamente antes del toast
              
              toast.promise(onShare(folder, "yel_pro"), {
                loading: "Compartiendo carpeta...",
                success: "Carpeta compartida en YEL Pro exitosamente",
                error: "Ocurrió un error al compartir la carpeta",
              });
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir en YEL Pro
          </DropdownMenuItem>


          {/* ELIMINAR */}
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              if (
                confirm(
                  `¿Eliminar la carpeta "${folder.name}" y todo su contenido?`,
                )
              ) {
                onDelete(folder);
              }
            }}
          >
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
