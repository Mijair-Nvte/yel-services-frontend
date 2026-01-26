"use client";

import { useEffect, useState } from "react";
import { DepartmentService } from "@/services/department/department.service";

export function useDepartmentTeam(departmentUid: string) {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await DepartmentService.team(departmentUid);
      setTeam(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentUid) {
      loadTeam();
    }
  }, [departmentUid]);

  return {
    team,
    loading,
    reload: loadTeam,
  };
}
