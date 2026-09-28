import { apiFetch } from "@/services/http";

export interface TrendChartData {
  name: string;
  newLeads: number;
  existingLeads: number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PeriodData {
  label: string;
  kpis: {
    total: number;
    new: number;
    existing: number;
  };
  trendChart: TrendChartData[];
  pieChart: PieChartData[];
}

export interface ContactsReportResponse {
  primary: PeriodData;
  comparison: PeriodData | null;
}


export interface EventPeriodData {
  label: string;
  kpis: {
    total_events: number;
    total_registrations: number;
    attendance_rate: number;
  };
  topEventsChart: { name: string; registrations: number }[];
  leadTypePie: PieChartData[];
  attendancePie: PieChartData[];
  sourcesPie: PieChartData[];
}

export interface EventsReportResponse {
  primary: EventPeriodData;
  comparison: EventPeriodData | null;
}



export interface SalesPeriodData {
  label: string;
  kpis: {
    total_revenue: number;
    total_sales: number;
    total_commissions: number;
  };
  topServicesChart: { name: string; revenue: number }[];
  customerTypePie: PieChartData[];
  topPartners: { name: string; total_sales: number; total_commissions: number }[];
}

export interface SalesReportResponse {
  primary: SalesPeriodData;
  comparison: SalesPeriodData | null;
}

export interface LoansPeriodData {
  label: string;
  kpis: {
    total_applications: number;
    total_volume: number;
    won_applications: number;
    total_commissions: number;
  };
  pipelinePie: PieChartData[];
  loanTypesChart: { name: string; volume: number; count: number }[];
}

export interface LoansReportResponse {
  primary: LoansPeriodData;
  comparison: LoansPeriodData | null;
}

export interface InsurancePeriodData {
  label: string;
  kpis: {
    total_applications: number;
    won_applications: number;
    conversion_rate: number;
    total_commissions: number;
  };
  pipelinePie: PieChartData[];
  insuranceTypesChart: { name: string; count: number }[];
}

export interface InsuranceReportResponse {
  primary: InsurancePeriodData;
  comparison: InsurancePeriodData | null;
}

export interface AiInsightsResponse {
  success: boolean;
  insights?: string;
  message?: string;
}


export const OrgReportingService = {
  getContactsReport: async (
    workspaceUid: string,
    start: string,
    end: string,
    compareStart?: string | null,
    compareEnd?: string | null
  ): Promise<ContactsReportResponse> => {

    const params = new URLSearchParams({ start, end });
    if (compareStart && compareEnd) {
      params.append("compare_start", compareStart);
      params.append("compare_end", compareEnd);
    }

    const response = await apiFetch(`/org-companies/${workspaceUid}/reporting/contacts?${params.toString()}`);
    return response.data ? response.data : response;
  },


  getEventsReport: async (
    workspaceUid: string,
    start: string,
    end: string,
    compareStart?: string | null,
    compareEnd?: string | null
  ): Promise<EventsReportResponse> => {

    const params = new URLSearchParams({ start, end });
    if (compareStart && compareEnd) {
      params.append("compare_start", compareStart);
      params.append("compare_end", compareEnd);
    }

    const response = await apiFetch(`/org-companies/${workspaceUid}/reporting/events?${params.toString()}`);
    return response.data ? response.data : response;
  },


  getSalesReport: async (
    workspaceUid: string,
    start: string,
    end: string,
    compareStart?: string | null,
    compareEnd?: string | null
  ): Promise<SalesReportResponse> => {
    const params = new URLSearchParams({ start, end });
    if (compareStart && compareEnd) {
      params.append("compare_start", compareStart);
      params.append("compare_end", compareEnd);
    }
    const response = await apiFetch(`/org-companies/${workspaceUid}/reporting/sales?${params.toString()}`);
    return response.data ? response.data : response;
  },


  getLoansReport: async (
    workspaceUid: string,
    start: string,
    end: string,
    compareStart?: string | null,
    compareEnd?: string | null
  ): Promise<LoansReportResponse> => {
    const params = new URLSearchParams({ start, end });
    if (compareStart && compareEnd) {
      params.append("compare_start", compareStart);
      params.append("compare_end", compareEnd);
    }
    const response = await apiFetch(`/org-companies/${workspaceUid}/reporting/loans?${params.toString()}`);
    return response.data ? response.data : response;
  },

  getInsuranceReport: async (
    workspaceUid: string, 
    start: string,
    end: string,
    compareStart?: string | null,
    compareEnd?: string | null
  ): Promise<InsuranceReportResponse> => {
    const params = new URLSearchParams({ start, end });
    if (compareStart && compareEnd) {
      params.append("compare_start", compareStart);
      params.append("compare_end", compareEnd);
    }
    const response = await apiFetch(`/org-companies/${workspaceUid}/reporting/insurance?${params.toString()}`);
    return response.data ? response.data : response;
  },

  generateAiInsights: async (
    workspaceUid: string, 
    start: string,
    end: string,
    compareStart?: string | null,
    compareEnd?: string | null
  ): Promise<AiInsightsResponse> => {
    const params = new URLSearchParams({ start, end });
    if (compareStart && compareEnd) {
      params.append("compare_start", compareStart);
      params.append("compare_end", compareEnd);
    }
    const response = await apiFetch(`/org-companies/${workspaceUid}/reporting/ai-insights?${params.toString()}`);
    return response.data ? response.data : response;
  },
};