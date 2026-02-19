"use client";

import { useEffect, useState } from "react";
import { OrgPositionService } from "@/services/org_position/org-position.service";
import { toast } from "sonner";

export function usePositions(workspaceUid: string, enabled: boolean) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await OrgPositionService.list(workspaceUid);
        setPositions(data);
      } catch {
        toast.error("Error cargando puestos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workspaceUid, enabled]);

  return {
    positions,
    loading,
  };
}
