import { apiFetch } from "@/services/http";

export const AdminPropertiesService = {
  getProperties: async (workspaceUid: string) => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/properties`);
    return response.data;
  },

  createProperty: async (workspaceUid: string, payload: any) => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/properties`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  updateProperty: async (workspaceUid: string, propertyUid: string, payload: any) => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/properties/${propertyUid}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  deleteProperty: async (workspaceUid: string, propertyUid: string) => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/properties/${propertyUid}`, {
      method: "DELETE",
    });
    return response;
  }
};