"use client";

import { useEffect, useState } from "react";
import { TimeTrackingService } from "@/services/time_tracking/time-tracking.service";
import { toast } from "sonner"; // Asumiendo que usas sonner para notificaciones, ajusta si usas otro

export function useTimeTracking(workspaceUid: string | undefined) {
    const [isTracking, setIsTracking] = useState(false);
    const [sessionData, setSessionData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // ===============================
    // ✅ LOAD STATUS
    // ===============================
    const loadStatus = async () => {
        if (!workspaceUid) return;
        setLoading(true);
        try {
            const res = await TimeTrackingService.getStatus(workspaceUid);
            setIsTracking(res.is_tracking);
            setSessionData(res.data);
        } catch (error) {
            console.error("Error cargando estado de time tracking:", error);
        } finally {
            setLoading(false);
        }
    };

    // ===============================
    // ✅ ACTIONS
    // ===============================
    const handleCheckIn = async () => {
        if (!workspaceUid) return;
        setActionLoading(true);
        try {
            const res = await TimeTrackingService.checkIn(workspaceUid);
            setIsTracking(true);
            setSessionData(res.data);
            toast.success("Check-in registrado. ¡Que tengas un excelente día!");
        } catch (error) {
            toast.error("Hubo un error al iniciar el tracking.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async (notes?: string) => {
        if (!workspaceUid) return;
        setActionLoading(true);
        try {
            await TimeTrackingService.checkOut(workspaceUid, { notes });
            setIsTracking(false);
            setSessionData(null);
            toast.success("Check-out registrado. ¡Buen trabajo!");
        } catch (error) {
            toast.error("Hubo un error al finalizar el tracking.");
        } finally {
            setActionLoading(false);
        }
    };

    // ===============================
    // ✅ EFFECT
    // ===============================
    useEffect(() => {
        loadStatus();
    }, [workspaceUid]);

    return {
        isTracking,
        sessionData,
        loading,
        actionLoading,
        handleCheckIn,
        handleCheckOut,
    };
}