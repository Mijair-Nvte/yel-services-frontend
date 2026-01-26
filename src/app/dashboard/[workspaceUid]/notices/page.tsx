"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { useOrgNotices } from "@/hooks/org_notices/use-org-notices";
import { OrgNoticeService } from "@/services/org_notices/org-notice.service";

import { NoticeHeader } from "@/components/org_notices/notice-header";
import { NoticeList } from "@/components/org_notices/notice-list";
import { NoticeSheet } from "@/components/org_notices/notice-sheet";

export default function NoticesPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { notices, loading, reload, removeNotice } =
    useOrgNotices(workspaceUid);

  const [open, setOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <NoticeHeader
        onCreate={() => {
          setEditingNotice(null);
          setOpen(true);
        }}
      />

      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando avisos…</div>
      ) : (
        <NoticeList
          notices={notices}
          onDelete={removeNotice}
          onEdit={(notice) => {
            setEditingNotice(notice);
            setOpen(true);
          }}
        />
      )}

      <NoticeSheet
        open={open}
        notice={editingNotice}
        onClose={() => {
          setOpen(false);
          setEditingNotice(null);
        }}
        onSubmit={async (data) => {
          if (editingNotice) {
            // ✏️ UPDATE
            await OrgNoticeService.update(editingNotice.uid, data);
          } else {
            // ➕ CREATE
            await OrgNoticeService.create(workspaceUid, data);
          }

          await reload();
        }}
      />
    </div>
  );
}
