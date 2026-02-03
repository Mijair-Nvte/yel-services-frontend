"use client";

import { useEffect, useState } from "react";
import { OrgLinkService } from "@/services/org_links/org-link.service";

export function useOrgLinks(workspaceUid: string) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // ✅ LOAD LINKS
  // ===============================
  const loadLinks = async () => {
    setLoading(true);

    try {
      const res = await OrgLinkService.list(workspaceUid);

      // ✅ IMPORTANTE: Laravel devuelve { data: [...] }
      setLinks(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ✅ DELETE LINK
  // ===============================
  const removeLink = async (uid: string) => {
    await OrgLinkService.delete(uid);
    await loadLinks();
  };

  // ===============================
  // ✅ EFFECT
  // ===============================
  useEffect(() => {
    if (workspaceUid) {
      loadLinks();
    }
  }, [workspaceUid]);

  return {
    links,
    loading,
    reload: loadLinks,
    removeLink,
  };
}
