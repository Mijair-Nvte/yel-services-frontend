import { apiFetch } from "@/services/http";

export const SalesService = {
    getSales: async (workspaceUid: string) => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/sales`);
        return response.data;
    },

    updateCommissionStatus: async (
        workspaceUid: string,
        saleId: number,
        newStatus: string,
        payoutDate: string | null,
        commissionAmount: number // <--- Agregado
    ) => {
        const response = await apiFetch(
            `/org-companies/${workspaceUid}/sales/${saleId}/commission`,
            {
                method: "PUT",
                body: JSON.stringify({
                    commission_status: newStatus,
                    seller_payout_date: payoutDate,
                    commission_amount: commissionAmount // <--- Agregado
                }),
            }
        );
        return response.data;
    },

    exportPdf: async (workspaceUid: string, saleIds: number[]) => {
        // 1. Usamos "auth_token" que es como lo guardas en tu sistema
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/org-companies/${workspaceUid}/sales/export-pdf`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // <--- CRÍTICO: Le dice a Laravel que somos una API
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({ sale_ids: saleIds })
        });

        if (!response.ok) {
            // Intentamos capturar el error del backend si existe
            const errorData = await response.json().catch(() => null);
            console.error("Error del backend:", errorData);
            throw errorData || new Error("Error al exportar el PDF");
        }

        const blob = await response.blob();
        return blob;
    },

    deleteSale: async (workspaceUid: string, saleId: number) => {
        const response = await apiFetch(
            `/org-companies/${workspaceUid}/sales/${saleId}`,
            { method: "DELETE" }
        );
        return response;
    },


    updateSaleDetails: async (
        workspaceUid: string,
        saleId: number,
        payload: {
            customer_name: string;
            customer_email: string;
            customer_phone: string;
            product_name: string;
            total_amount: number;
            seller_id?: number | null;
        }
    ) => {
        const response = await apiFetch(
            `/org-companies/${workspaceUid}/sales/${saleId}`,
            {
                method: "PUT",
                body: JSON.stringify(payload),
            }
        );
        return response.data;
    },

};