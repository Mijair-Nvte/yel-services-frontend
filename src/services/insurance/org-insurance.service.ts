import { apiFetch } from "@/services/http";

// 1. Declaramos la interfaz aquí mismo en el proyecto Admin
export interface InsuranceApplication {
  id: number;
  uid: string;
  org_company_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  applicant_address: string;
  insurance_type: string;
  status: "pending" | "reviewing" | "approved" | "rejected" | "completed";
  created_at: string;
  updated_at: string;
}

export interface UpdateInsuranceDto {
  status?: string;
  insurance_type?: string;
}

export const OrgInsuranceService = {
  getAll: async (workspaceUid: string): Promise<InsuranceApplication[]> => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/insurance-applications`);
    return response.data;
  },

  getOne: async (workspaceUid: string, applicationUid: string): Promise<InsuranceApplication> => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/insurance-applications/${applicationUid}`);
    return response.data;
  },

  update: async (workspaceUid: string, applicationUid: string, data: UpdateInsuranceDto) => {
    return await apiFetch(`/org-companies/${workspaceUid}/insurance-applications/${applicationUid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (workspaceUid: string, applicationUid: string) => {
    return await apiFetch(`/org-companies/${workspaceUid}/insurance-applications/${applicationUid}`, {
      method: "DELETE",
    });
  },
};