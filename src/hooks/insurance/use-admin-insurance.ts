"use client";

import { useState, useCallback } from "react";

import { toast } from "sonner";
import { OrgInsuranceService, UpdateInsuranceDto, InsuranceApplication } from "@/services/insurance/org-insurance.service";
export function useAdminInsurance(workspaceUid: string) {
    const [applications, setApplications] = useState<InsuranceApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!workspaceUid) return;
        setIsLoading(true);
        try {
            const res = await OrgInsuranceService.getAll(workspaceUid);
            setApplications(res || []);
        } catch (error) {
            console.error("Error loading insurance applications:", error);
            toast.error("Error al cargar las solicitudes de seguros.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid]);

    const updateApplication = async (applicationUid: string, data: UpdateInsuranceDto) => {
        try {
            await OrgInsuranceService.update(workspaceUid, applicationUid, data);
            toast.success("Solicitud actualizada correctamente.");
            await loadData(); // Recargar datos
        } catch (error: unknown) {
            toast.error("Ocurrió un error al actualizar la solicitud.");
            throw error;
        }
    };

    const deleteApplication = async (applicationUid: string) => {
        try {
            await OrgInsuranceService.delete(workspaceUid, applicationUid);
            toast.success("Solicitud eliminada correctamente.");
            await loadData(); // Recargar datos
        } catch (error: unknown) {
            toast.error("Error al eliminar la solicitud.");
            throw error;
        }
    };

    return {
        applications,
        isLoading,
        loadData,
        updateApplication,
        deleteApplication,
    };
}