"use client";
import { useParams } from "next/navigation"; 
import { useEffect, useState } from "react";
import { DepartmentService } from "@/services/org_department/org-area.service";

export function useDepartmentTeam(departmentUid: string) {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeam = async () => {
    if (!workspaceUid || !departmentUid) return;

    setLoading(true);
    try {

      const data = await DepartmentService.team(workspaceUid, departmentUid);
      setTeam(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [workspaceUid, departmentUid]);

  return { team, loading, reload: loadTeam };
}