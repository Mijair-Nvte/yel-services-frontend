"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { OrgLoanService, UpdateLoanDto, LoanApplication } from "@/services/org-loan/org-loan.service";

export function useAdminLoans(workspaceUid: string) {
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!workspaceUid) return;
        setIsLoading(true);
        try {
            const res = await OrgLoanService.getAll(workspaceUid);
            setApplications(res || []);
        } catch (error) {
            console.error("Error loading loan applications:", error);
            toast.error("Error al cargar las solicitudes de préstamos.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid]);

    const updateApplication = async (applicationUid: string, data: UpdateLoanDto) => {
        try {
            await OrgLoanService.update(workspaceUid, applicationUid, data);
            toast.success("Solicitud actualizada correctamente.");
            await loadData();
        } catch (error: unknown) {
            toast.error("Ocurrió un error al actualizar la solicitud.");
            throw error;
        }
    };

    const deleteApplication = async (applicationUid: string) => {
        try {
            await OrgLoanService.delete(workspaceUid, applicationUid);
            toast.success("Solicitud eliminada correctamente.");
            await loadData();
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