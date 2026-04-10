import { useState, useEffect, useCallback } from "react";
import { SalesService } from "@/services/org_sales/sales.service";

export function useSales(workspaceUid: string) {
    const [sales, setSales] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSales = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await SalesService.getSales(workspaceUid);
            setSales(data);
        } catch (err: any) {
            console.error("Error obteniendo ventas:", err);
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid]);

    useEffect(() => {
        if (workspaceUid) {
            fetchSales();
        }
    }, [workspaceUid, fetchSales]);

    const updateStatus = async (saleId: number, newStatus: string) => {
        try {
            // Actualización visual instantánea (Optimistic update)
            setSales((prev) =>
                prev.map((s) =>
                    s.id === saleId ? { ...s, commission_status: newStatus } : s
                )
            );

            // Petición real al servidor
            await SalesService.updateCommissionStatus(workspaceUid, saleId, newStatus);
        } catch (err) {
            console.error("Error al actualizar estatus", err);
            fetchSales(); // Revertimos si hay error
        }
    };

    return { sales, isLoading, updateStatus, refreshSales: fetchSales };
}