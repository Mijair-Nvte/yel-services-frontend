"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function ResourceBreadcrumb({
  folderStack,
  onRoot,
  onNavigate,
}: {
  folderStack: any[];
  onRoot: () => void;
  onNavigate: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Button variant="link" onClick={onRoot} className="px-1">
        Recursos
      </Button>

      {folderStack.map((folder, index) => (
        <div key={folder.id} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          <Button
            variant="link"
            className="px-1"
            onClick={() => onNavigate(index)}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
