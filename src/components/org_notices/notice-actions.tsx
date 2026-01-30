"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Pin, PinOff, Trash } from "lucide-react";

export function NoticeActions({
  notice,
  onDelete,
  onEdit,
  onTogglePin,
}: {
  notice: any;
  onDelete?: (uid: string) => void;
  onEdit?: () => void;
  onTogglePin?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4 " />Editar</DropdownMenuItem>
        <DropdownMenuItem onClick={onTogglePin}>
          {notice.is_pinned ? (
            <>
              <PinOff className="mr-2 h-4 w-4 text-destructive" />
              Desfijar
            </>
          ) : (
            <>
              <Pin className="mr-2 h-4 w-4" />
              Fijar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete?.(notice.uid)}
        >
           <Trash className="mr-2 h-4 w-4 text-destructive" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
