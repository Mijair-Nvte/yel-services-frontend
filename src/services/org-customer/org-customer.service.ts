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

export interface PaginatedMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface PaginatedCustomers {
    data: OrgCustomer[];
    meta: PaginatedMeta;
}


export const OrgCustomerService = {
 getAll: async (workspaceUid: string, page: number = 1, perPage: number = 100, search: string = ""): Promise<PaginatedCustomers> => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", perPage.toString());
        if (search) params.append("search", search);

        return await apiFetch(`/org-companies/${workspaceUid}/customers?${params.toString()}`);
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