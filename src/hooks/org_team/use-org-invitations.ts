"use client";

import { useState } from "react";
import { OrgTeamInviteService } from "@/services/org_settings/team/org-team-invite.service";

export function useOrgInvitations(workspaceUid: string) {
  const [loading, setLoading] = useState(false);

  const inviteMember = async (
    email: string,
    role: string,
    orgAreaId?: string | null,
    permissions: string[] = [] // Recibimos los permisos
  ) => {
    setLoading(true);

    try {
      return await OrgTeamInviteService.invite(workspaceUid, {
        email,
        role,
        org_area_id: orgAreaId ? Number(orgAreaId) : null,
        permissions, // Lo enviamos al backend
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