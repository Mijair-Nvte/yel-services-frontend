"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamGrid } from "@/components/org_team/team-grid";

import { OrgUserService } from "@/services/org_settings/users/org-user.service";

export default function TeamPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!workspaceUid) return;

    setLoading(true);
    try {
    
      const data = await OrgUserService.getDirectory(workspaceUid);
      setMembers(data);
    } catch (error) {
      console.error("Error cargando el directorio", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [workspaceUid]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Equipo</h1>
          <p className="text-muted-foreground text-sm">
            Personas que forman parte de esta compañía
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando equipo…</div>
      ) : (
        <TeamGrid members={members} workspaceUid={workspaceUid} reload={load} />
      )}
    </div>
  );
}
