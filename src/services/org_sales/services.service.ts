import { apiFetch } from "@/services/http";

export const OrgServicesService = {
    getAll: async (workspaceUid: string) => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/services`);
        return response.data;
    },

    create: async (workspaceUid: string, data: any) => {
        return await apiFetch(`/org-companies/${workspaceUid}/services`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (workspaceUid: string, serviceUid: string, data: any) => {
        return await apiFetch(`/org-companies/${workspaceUid}/services/${serviceUid}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (workspaceUid: string, serviceUid: string) => {
        return await apiFetch(`/org-companies/${workspaceUid}/services/${serviceUid}`, {
            method: "DELETE",
        });
    },
};