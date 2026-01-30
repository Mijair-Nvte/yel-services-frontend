"use client";

import { useEffect, useState } from "react";
import { OrgNoticeService } from "@/services/org_notices/org-notice.service";

export function useOrgNotices(
  workspaceUid: string,
  areaUid?: string, // 👈 opcional
) {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // ✅ LOAD NOTICES
  // ===============================
  const loadNotices = async () => {
    setLoading(true);

    try {
      let data;

      // ✅ Si hay área → cargar por departamento
      if (areaUid) {
        data = await OrgNoticeService.listByArea(workspaceUid, areaUid);
      }

      // ✅ Si no hay área → global company
      else {
        data = await OrgNoticeService.listGlobalCompanie(workspaceUid);
      }

      setNotices(data);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ✅ DELETE NOTICE
  // ===============================
  const removeNotice = async (uid: string) => {
    await OrgNoticeService.delete(uid);
    await loadNotices(); // refresca lista
  };

  // ===============================
  // ✅ EFFECT
  // ===============================
  useEffect(() => {
    if (workspaceUid) {
      loadNotices();
    }
  }, [workspaceUid, areaUid]); // 👈 importante

  return {
    notices,
    loading,
    reload: loadNotices,
    removeNotice,
  };
}
