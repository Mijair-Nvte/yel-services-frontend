"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrgPartnerAdminService } from "@/services/org_partners/org-partner-admin.service";

export function useOrgPartnersAdmin(workspaceUid: string, statusFilter: string = "") {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPartners = async () => {
        setLoading(true);
        try {
            // Pasamos el filtro (si está vacío, el backend traerá todos)
            const res = await OrgPartnerAdminService.list(workspaceUid, statusFilter);
            setPartners(res.data || res || []);
        } catch (error) {
            toast.error("Error al cargar las solicitudes.");
        } finally {
            setLoading(false);
        }
    };

    const approvePartner = async (partnerId: string | number) => {
        try {
            await OrgPartnerAdminService.approve(workspaceUid, partnerId);
            toast.success("Partner aprobado exitosamente.");
            await loadPartners();
        } catch (error: any) {
            toast.error(error.message || "Error al aprobar al partner.");
        }
    };

    const rejectPartner = async (partnerId: string | number) => {
        try {
            await OrgPartnerAdminService.reject(workspaceUid, partnerId);
            toast.success("Solicitud rechazada.");
            await loadPartners();
        } catch (error: any) {
            toast.error(error.message || "Error al rechazar al partner.");
        }
    };

    useEffect(() => {
        if (workspaceUid) {
            loadPartners();
        }
    }, [workspaceUid, statusFilter]);

    return {
        partners,
        loading,
        reload: loadPartners,
        approvePartner,
        rejectPartner,
    };
}