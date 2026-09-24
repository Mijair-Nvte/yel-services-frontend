import { apiFetch } from "@/services/http";

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

export interface OrgEvent {
  id: number;
  uid: string;
  org_company_id: number;
  title: string;
  description?: string;
  color: string;
  location?: string;
  meeting_url?: string;
  external_url?: string;
  target_platform: "yel_services" | "yel_pro" | "yel_investor";
  starts_at: string;
  ends_at?: string;
  is_all_day: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  registrations_count?: number;
  attended_count?: number;
  unattended_count?: number;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  color?: string;
  location?: string;
  meeting_url?: string;
  target_platform: string;
  starts_at: string;
  ends_at?: string;
  is_all_day?: boolean;
}

export interface EventRegistration {
  id: number;
  uid: string;
  status: "registered" | "attended" | "cancelled";
  created_at: string;
  customer?: {
    id: number;
    uid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    ghl_contact_id?: string;
  };
}

export const OrgEventService = {
  getAll: async (workspaceUid: string): Promise<OrgEvent[]> => {
    // Reutilizando tu endpoint actual (puedes ajustar los parámetros from/to según necesites)
    const from = new Date(new Date().getFullYear(), 0, 1).toISOString();
    const to = new Date(new Date().getFullYear() + 1, 11, 31).toISOString();
    const response = await apiFetch(`/org-companies/${workspaceUid}/events?from=${from}&to=${to}`);
    return response;
  },

  getOne: async (workspaceUid: string, eventUid: string): Promise<OrgEvent> => {
    return await apiFetch(`/org-companies/${workspaceUid}/events/${eventUid}`);
  },

  create: async (workspaceUid: string, data: FormData) => {

    return await fetchMultipart(`/org-companies/${workspaceUid}/events`, data);
  },

  update: async (workspaceUid: string, eventUid: string, data: FormData) => {

    return await fetchMultipart(`/org-companies/${workspaceUid}/events/${eventUid}`, data);
  },

  delete: async (workspaceUid: string, eventUid: string) => {
    return await apiFetch(`/org-companies/${workspaceUid}/events/${eventUid}`, {
      method: "DELETE",
    });
  },

  // Dentro del objeto OrgEventService, agrega este método:
  getRegistrations: async (workspaceUid: string, eventUid: string): Promise<EventRegistration[]> => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/events/${eventUid}/registrations`);
    return response.data || response;
  },

};