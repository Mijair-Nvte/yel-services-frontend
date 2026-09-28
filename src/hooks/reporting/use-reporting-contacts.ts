import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { OrgReportingService, ContactsReportResponse } from "@/services/reporting/org-reporting.service";

export function useReportingContacts(
    workspaceUid: string,
    start: string,
    end: string,
    isComparing: boolean,
    compareStart: string,
    compareEnd: string
) {
    const [data, setData] = useState<ContactsReportResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!workspaceUid) return;

        setIsLoading(true);
        try {
            const activeCompareStart = isComparing ? compareStart : null;
            const activeCompareEnd = isComparing ? compareEnd : null;
            
            const res = await OrgReportingService.getContactsReport(
                workspaceUid, 
                start, 
                end, 
                activeCompareStart, 
                activeCompareEnd
            );
            setData(res);
        } catch (error) {
            console.error("Error loading contacts report:", error);
            toast.error("Error al cargar el reporte de contactos.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid, start, end, isComparing, compareStart, compareEnd]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { data, isLoading, refetch: loadData };
}