// src/components/org_resources/folder-list.tsx
"use client";

import { FolderCard } from "./folder-card";

export function FolderList({
  folders,
  onOpen,
  onRename,
  onDelete,
}: {
  folders: any[];
  onOpen: (folder: any) => void;
  onRename: (folder: any, name: string) => Promise<void>;
  onDelete: (folder: any) => Promise<void>;
}) {
  if (!folders.length) {
    return (
      <p className="text-sm text-muted-foreground">No hay carpetas creadas.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onOpen={() => onOpen(folder)}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
