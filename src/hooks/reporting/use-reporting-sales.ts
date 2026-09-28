import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { OrgReportingService, SalesReportResponse } from "@/services/reporting/org-reporting.service";

export function useReportingSales(
    workspaceUid: string,
    start: string,
    end: string,
    isComparing: boolean,
    compareStart: string,
    compareEnd: string
) {
    const [data, setData] = useState<SalesReportResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!workspaceUid) return;
        setIsLoading(true);
        try {
            const activeCompareStart = isComparing ? compareStart : null;
            const activeCompareEnd = isComparing ? compareEnd : null;
            const res = await OrgReportingService.getSalesReport(workspaceUid, start, end, activeCompareStart, activeCompareEnd);
            setData(res);
        } catch (error) {
            console.error("Error loading sales report:", error);
            toast.error("Error al cargar el reporte de ventas.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid, start, end, isComparing, compareStart, compareEnd]);

    useEffect(() => { loadData(); }, [loadData]);

    return { data, isLoading, refetch: loadData };
}