"use client";

import { NoticeCard } from "./notice-card";
import { NoticeEmpty } from "./notice-empty";

export function NoticeList({
  notices,
  onDelete,
  onEdit,
  onTogglePin, 
}: {
  notices: any[];
  onDelete?: (uid: string) => void;
  onEdit?: (notice: any) => void;
    onTogglePin?: (notice: any) => void;
}) {
  const sorted = [...notices].sort((a, b) => {
    return Number(b.is_pinned) - Number(a.is_pinned);
  });

  if (notices.length === 0) {
    return <NoticeEmpty />;
  }

  return (
    <div className="space-y-4">
      {sorted.map((notice) => (
        <NoticeCard
          key={notice.uid}
          notice={notice}
          onDelete={onDelete}
          onEdit={() => onEdit?.(notice)}
           onTogglePin={() => onTogglePin?.(notice)}
        />
      ))}
    </div>
  );
}
