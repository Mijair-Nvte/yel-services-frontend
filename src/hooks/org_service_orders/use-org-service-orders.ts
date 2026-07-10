"use client";

import { useEffect, useState } from "react";
import { OrgServiceOrderService } from "@/services/org_service_orders/org-service-order.service";
import { toast } from "sonner";

export function useOrgServiceOrders(workspaceUid: string) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ===============================
    // ✅ LOAD SERVICE ORDERS
    // ===============================
    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await OrgServiceOrderService.list(workspaceUid);
            // ✅ IMPORTANTE: El controlador devuelve { data: [...] }
            setOrders(res.data ?? []);
        } catch (error: any) {
            toast.error("Error al cargar las órdenes de servicio");
        } finally {
            setLoading(false);
        }
    };

    // ===============================
    // ✅ DELETE ORDER
    // ===============================
    const removeOrder = async (uid: string) => {
        try {
            await OrgServiceOrderService.delete(workspaceUid, uid);
            toast.success("Orden eliminada correctamente");
            await loadOrders();
        } catch (error: any) {
            toast.error("Error al eliminar la orden");
        }
    };

    // ===============================
    // ✅ EFFECT
    // ===============================
    useEffect(() => {
        if (workspaceUid) {
            loadOrders();
        }
    }, [workspaceUid]);

    return {
        orders,
        loading,
        reload: loadOrders,
        removeOrder,
    };
}