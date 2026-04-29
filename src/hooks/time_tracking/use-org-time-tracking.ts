"use client";

import { useEffect, useState } from "react";
import { TimeTrackingService } from "@/services/time_tracking/time-tracking.service";

export function useOrgTimeTracking(workspaceUid: string) {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRecords = async (page = 1) => {
        setLoading(true);
        try {
            // Usamos el método list que agregaste a tu service
            const res = await TimeTrackingService.list(workspaceUid, { page });
            // Laravel devuelve la data paginada dentro de "data.data" a veces, 
            // ajusta "res.data" o "res.data.data" según cómo lo retorne tu backend.
            setRecords(res.data ?? []);
        } catch (error) {
            console.error("Error cargando historial:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workspaceUid) loadRecords();
    }, [workspaceUid]);

    return { records, loading, reload: loadRecords };
}