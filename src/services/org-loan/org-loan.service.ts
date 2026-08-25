import { apiFetch } from "@/services/http";



export interface LoanApplication {
  id: number;
  uid: string;
  org_company_id: number;
  user_id: number;
  org_customer_id?: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  applicant_address: string;
  applicant_state: string;
  loan_type: string;
  estimated_amount?: number;
  status: "pending" | "reviewing" | "approved" | "rejected" | "completed";
  notes?: string;
  commission_amount?: number;
  commission_status?: "pending" | "paid" | "not_applicable";
  seller_payout_date?: string;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    uid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    state: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}


export interface UpdateLoanDto {
  status?: string;
  loan_type?: string;
  commission_amount?: number;
  commission_status?: "pending" | "paid" | "not_applicable";
  seller_payout_date?: string;
}

export const OrgLoanService = {
  getAll: async (workspaceUid: string): Promise<LoanApplication[]> => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/loan-applications`);
    return response.data;
  },

  getOne: async (workspaceUid: string, applicationUid: string): Promise<LoanApplication> => {
    const response = await apiFetch(`/org-companies/${workspaceUid}/loan-applications/${applicationUid}`);
    return response.data;
  },

  update: async (workspaceUid: string, applicationUid: string, data: UpdateLoanDto) => {
    return await apiFetch(`/org-companies/${workspaceUid}/loan-applications/${applicationUid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (workspaceUid: string, applicationUid: string) => {
    return await apiFetch(`/org-companies/${workspaceUid}/loan-applications/${applicationUid}`, {
      method: "DELETE",
    });
  },
};