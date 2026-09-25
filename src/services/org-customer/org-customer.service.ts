import { apiFetch } from "@/services/http";

export interface OrgCustomer {
    id: number;
    uid: string;
    org_company_id: number;
    first_name: string;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    user_id?: number | null;
    metadata?: Record<string, any> | null;
    contact_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCustomerDto {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    metadata?: Record<string, any>;
}

export interface UpdateCustomerDto {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    metadata?: Record<string, any>;
}

export const OrgCustomerService = {
    getAll: async (workspaceUid: string): Promise<OrgCustomer[]> => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/customers`);
        return response.data;
    },

    getOne: async (workspaceUid: string, customerUid: string): Promise<OrgCustomer> => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/customers/${customerUid}`);
        return response.data;
    },

    create: async (workspaceUid: string, data: CreateCustomerDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/customers`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (workspaceUid: string, customerUid: string, data: UpdateCustomerDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/customers/${customerUid}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (workspaceUid: string, customerUid: string) => {
        return await apiFetch(`/org-companies/${workspaceUid}/customers/${customerUid}`, {
            method: "DELETE",
        });
    },


    getLoans: async (workspaceUid: string, customerUid: string) => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/customers/${customerUid}/loans`);
        return response.data;
    },

    getInsurances: async (workspaceUid: string, customerUid: string) => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/customers/${customerUid}/insurances`);
        return response.data;
    },

    getEvents: async (workspaceUid: string, customerUid: string) => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/customers/${customerUid}/events`);
        return response.data;
    },

    getServiceOrders: async (workspaceUid: string, customerUid: string) => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/customers/${customerUid}/service-orders`);
        return response.data;
    },

};