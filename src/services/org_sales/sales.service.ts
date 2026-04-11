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
};