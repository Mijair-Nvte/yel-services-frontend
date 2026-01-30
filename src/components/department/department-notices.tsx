"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { useOrgNotices } from "@/hooks/org_notices/use-org-notices";
import { OrgNoticeService } from "@/services/org_notices/org-notice.service";

import { NoticeHeader } from "@/components/org_notices/notice-header";
import { NoticeList } from "@/components/org_notices/notice-list";
import { NoticeSheet } from "@/components/org_notices/notice-sheet";

export function DepartmentNotices({
  departmentUid,
}: {
  departmentUid: string;
}) {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  // ✅ Hook reutilizado pero ahora cargando avisos del área
  const { notices, loading, reload, removeNotice } = useOrgNotices(
    workspaceUid,
    departmentUid,
  );

  const [open, setOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {/* ✅ HEADER reutilizado */}
      <NoticeHeader
        onCreate={() => {
          setEditingNotice(null);
          setOpen(true);
        }}
      />

      {/* ✅ LIST reutilizada */}
      {loading ? (
        <div className="text-sm text-muted-foreground">
          Cargando avisos del departamento…
        </div>
      ) : (
        <NoticeList
          notices={notices}
          onDelete={removeNotice}
          onEdit={(notice) => {
            setEditingNotice(notice);
            setOpen(true);
          }}
          onTogglePin={async (notice) => {
            if (notice.is_pinned) {
              await OrgNoticeService.unpin(notice.uid);
            } else {
              await OrgNoticeService.pin(notice.uid);
            }

            await reload();
          }}
        />
      )}

      {/* ✅ SHEET reutilizado */}
      <NoticeSheet
        open={open}
        notice={editingNotice}
        onClose={() => {
          setOpen(false);
          setEditingNotice(null);
        }}
        onSubmit={async (data) => {
          if (editingNotice) {
            // ✏️ UPDATE normal
            await OrgNoticeService.update(editingNotice.uid, data);
          } else {
            // ➕ CREATE para departamento (área)
            await OrgNoticeService.createForArea(
              workspaceUid,
              departmentUid,
              data,
            );
          }

          await reload();
        }}
      />
    </div>
  );
}
