"use client";

import { LinkCard } from "./link-card";
import { LinkEmpty } from "./link-empty";

export function LinkList({
  links,
  onDelete,
  onEdit,
}: {
  links: any[];
  onDelete?: (uid: string) => void;
  onEdit?: (link: any) => void;
}) {
  if (links.length === 0) {
    return <LinkEmpty />;
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <LinkCard
          key={link.uid}
          link={link}
          onDelete={onDelete}
          onEdit={() => onEdit?.(link)}
        />
      ))}
    </div>
  );
}
