"use client";

import { useEffect, useState } from "react";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export function useDashboard(workspaceUid: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const res = await DashboardService.overview(workspaceUid);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceUid) {
      loadDashboard();
    }
  }, [workspaceUid]);

  return {
    data,
    loading,
    reload: loadDashboard,
  };
}