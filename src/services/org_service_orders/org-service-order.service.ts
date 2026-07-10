import { apiFetch } from "@/services/http";

export const OrgServiceOrderService = {
    // LISTAR ÓRDENES (GET)
    list: (workspaceUid: string) =>
        apiFetch(`/org-companies/${workspaceUid}/service-orders`),

    // VER UNA ORDEN ESPECÍFICA (GET)
    getOne: (workspaceUid: string, orderUid: string) =>
        apiFetch(`/org-companies/${workspaceUid}/service-orders/${orderUid}`),

    // ACTUALIZAR ESTADOS, OWNER O FOLLOWERS (PUT)
    update: (workspaceUid: string, orderUid: string, payload: any) =>
        apiFetch(`/org-companies/${workspaceUid}/service-orders/${orderUid}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),

    // ELIMINAR ORDEN (DELETE)
    delete: (workspaceUid: string, orderUid: string) =>
        apiFetch(`/org-companies/${workspaceUid}/service-orders/${orderUid}`, {
            method: "DELETE",
        }),
};