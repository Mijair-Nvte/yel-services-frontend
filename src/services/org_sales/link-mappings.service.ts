import { apiFetch } from "@/services/http";

export const LinkMappingService = {
  getAll: async (workspaceUid: string) => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/payment-link-mappings`);
    return response.data;
  },

  create: async (workspaceUid: string, data: any) => {
    return await apiFetch(`/org-companies/${workspaceUid}/payment-link-mappings`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (workspaceUid: string, mappingUid: string, data: any) => {
    return await apiFetch(`/org-companies/${workspaceUid}/payment-link-mappings/${mappingUid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (workspaceUid: string, mappingUid: string) => {
    return await apiFetch(`/org-companies/${workspaceUid}/payment-link-mappings/${mappingUid}`, {
      method: "DELETE",
    });
  },
};