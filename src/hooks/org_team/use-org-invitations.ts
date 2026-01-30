"use client";

import { useState } from "react";
import { OrgCompanyService } from "@/services/org_company/org-company.service";

export function useOrgInvitations(workspaceUid: string) {
  const [loading, setLoading] = useState(false);

  // ✅ INVITE MEMBER
  const inviteMember = async (
    email: string,
    role: string,
    orgAreaId?: string | null,
  ) => {
    setLoading(true);

    try {
      return await OrgCompanyService.invite(workspaceUid, {
        email,
        role,
        org_area_id: orgAreaId ? Number(orgAreaId) : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    inviteMember,
    loading,
  };
}
