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
        if (workspaceUid) fetchSales();
    }, [workspaceUid, fetchSales]);

    const updateStatus = async (saleId: number, newStatus: string, payoutDate: string | null, commissionAmount: number) => {
        try {
            await SalesService.updateCommissionStatus(workspaceUid, saleId, newStatus, payoutDate, commissionAmount);
            
            // Actualizamos localmente para reflejar el cambio en la tabla
            setSales((prev) =>
                prev.map((s) =>
                    s.id === saleId ? { 
                        ...s, 
                        commission_status: newStatus, 
                        seller_payout_date: payoutDate,
                        commission_amount: commissionAmount 
                    } : s
                )
            );
        } catch (err) {
            console.error("Error al actualizar", err);
            fetchSales();
        }
    };


    const removeSale = async (saleId: number) => {
        try {
            await SalesService.deleteSale(workspaceUid, saleId);
            // Quitamos la venta del estado visual automáticamente
            setSales((prev) => prev.filter((s) => s.id !== saleId));
        } catch (err) {
            console.error("Error al eliminar", err);
            fetchSales(); // Si falla, recargamos la lista por seguridad
        }
    };


    const editSaleDetails = async (saleId: number, payload: any) => {
        try {
            const updatedSale = await SalesService.updateSaleDetails(workspaceUid, saleId, payload);
            setSales((prev) =>
                prev.map((s) => (s.id === saleId ? updatedSale : s))
            );
            return updatedSale;
        } catch (err) {
            console.error("Error al actualizar detalles", err);
            throw err;
        }
    };

    return { sales, isLoading, updateStatus,removeSale,editSaleDetails, refreshSales: fetchSales };
}