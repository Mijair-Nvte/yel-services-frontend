import { apiFetch } from "@/services/http";

// Helper aislado exclusivamente para procesar FormData con archivos.
// No interfiere con el resto de tu aplicación.
const fetchMultipart = async (endpoint: string, formData: FormData) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: "POST", // Para enviar archivos SIEMPRE usamos POST (incluso si es actualización con _method=PUT)
    body: formData,
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      // 🚨 IMPORTANTE: NO enviamos el Content-Type para que el navegador genere 
      // automáticamente el boundary del multipart/form-data
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

export const OrgServicesService = {
  getAll: async (workspaceUid: string) => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/services`);
    return response.data;
  },

  create: async (workspaceUid: string, data: FormData) => {
    // Usamos nuestro helper multipart
    return await fetchMultipart(`/org-companies/${workspaceUid}/services`, data);
  },

  update: async (workspaceUid: string, serviceUid: string, data: FormData) => {
    // Como tu componente ya hace data.append("_method", "PUT"), 
    // Laravel sabrá que es una actualización aunque fetchMultipart use POST internamente.
    return await fetchMultipart(`/org-companies/${workspaceUid}/services/${serviceUid}`, data);
  },

  delete: async (workspaceUid: string, serviceUid: string) => {
    return await apiFetch(`/org-companies/${workspaceUid}/services/${serviceUid}`, {
      method: "DELETE",
    });
  },
};