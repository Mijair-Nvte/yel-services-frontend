"use client";

import { NoticeCard } from "./notice-card";
import { NoticeEmpty } from "./notice-empty";

export function NoticeList({
  notices,
  onDelete,
  onEdit,
}: {
  notices: any[];
  onDelete?: (uid: string) => void;
  onEdit?: (notice: any) => void;
}) {
  if (notices.length === 0) {
    return <NoticeEmpty />;
  }

  return (
    <div className="space-y-4">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.uid}
          notice={notice}
          onDelete={onDelete}
          onEdit={() => onEdit?.(notice)}
        />
      ))}
    </div>
  );
}
