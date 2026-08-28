import { apiFetch } from "@/services/http";

export interface InsuranceApplication {
  id: number;
  uid: string;
  org_company_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  applicant_address: string;
  insurance_type: string;
status: "Open" | "Lost" | "Won" | "Abandon";
won_at?: string | null;
  commission_amount?: number;
  commission_status?: "pending" | "paid" | "not_applicable";
  seller_payout_date?: string;
  created_at: string;
  updated_at: string;
  // Relación con cliente
  customer?: {
    id: number;
    uid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
   user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UpdateInsuranceDto {
 status?: "Open" | "Lost" | "Won" | "Abandon";
  insurance_type?: string;
  // Nuevos campos para actualizar
  commission_amount?: number;
  commission_status?: "pending" | "paid" | "not_applicable";
  seller_payout_date?: string;
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