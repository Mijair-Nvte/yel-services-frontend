"use client";

import { useEffect, useState } from "react";
import { OrgNoticeService } from "@/services/org_notices/org-notice.service";

export function useOrgNotices(workspaceUid: string) {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await OrgNoticeService.list(workspaceUid);
      setNotices(data);
    } finally {
      setLoading(false);
    }
  };

  const removeNotice = async (uid: string) => {
    await OrgNoticeService.delete(uid);
    await loadNotices(); // 🔥 refresca lista
  };

  useEffect(() => {
    if (workspaceUid) {
      loadNotices();
    }
  }, [workspaceUid]);

  return {
    notices,
    loading,
    reload: loadNotices,
    removeNotice,
  };
}
