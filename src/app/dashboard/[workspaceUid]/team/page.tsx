"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamGrid } from "@/components/org_team/team-grid";
import { OrgCompanyService } from "@/services/org_company/org-company.service";

export default function TeamPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceUid) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await OrgCompanyService.team(workspaceUid);
        setMembers(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workspaceUid]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Equipo</h1>
        <p className="text-muted-foreground text-sm">
          Personas que forman parte de esta compañía
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">
          Cargando equipo…
        </div>
      ) : (
        <TeamGrid members={members} />
      )}
    </div>
  );
}
