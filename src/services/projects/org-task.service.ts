import { apiFetch } from "@/services/http";

export interface OrgProjectTask {
  id: number;
  uid: string;
  org_company_id: number;
  org_project_id: number;
  name: string;
  description?: string;
  department: string; // marketing_redes, pauta, eventos, ventas, etc.
  platform?: string;    // facebook, instagram, tiktok, google_ads, etc.
  task_type?: string;   // reel, carrusel, ad_campaign, etc.
   phase?: string | null;  
   is_milestone: boolean;
  start_date?: string;
  end_date?: string;
  status: "pending" | "in_progress" | "review" | "completed";
  assigned_to?: number;
  org_event_id?: number;
  metadata?: {
    budget?: number;
    spent?: number;
    reach?: number;
    leads?: number;
    roas?: number;
    ad_copy?: string;
    target_audience?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
  event?: {
    id: number;
    uid: string;
    title: string;
    starts_at: string;
  };
}

export interface SaveTaskDto {
  name: string;
  description?: string;
  department: string;
  platform?: string;
  task_type?: string;
   phase?: string | null;
  is_milestone?: boolean;
  start_date?: string;
  end_date?: string;
  status?: string;
  assigned_to?: number | null;
  org_event_id?: number | null;
  metadata?: Record<string, any>;
}

export const OrgTaskService = {
  getAll: async (workspaceUid: string, projectUid: string): Promise<OrgProjectTask[]> => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects/${projectUid}/tasks`);
  },

  create: async (workspaceUid: string, projectUid: string, data: SaveTaskDto): Promise<OrgProjectTask> => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects/${projectUid}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (workspaceUid: string, projectUid: string, taskUid: string, data: Partial<SaveTaskDto>): Promise<OrgProjectTask> => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects/${projectUid}/tasks/${taskUid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (workspaceUid: string, projectUid: string, taskUid: string) => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects/${projectUid}/tasks/${taskUid}`, {
      method: "DELETE",
    });
  },
};