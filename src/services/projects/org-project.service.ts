import { apiFetch } from "@/services/http";

export interface OrgProject {
  id: number;
  uid: string;
  org_company_id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "draft" | "active" | "completed" | "archived";
  created_by: number;
  created_at: string;
  updated_at: string;
  tasks_count?: number; 
  creator?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

export const OrgProjectService = {
  getAll: async (workspaceUid: string): Promise<OrgProject[]> => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects`);
  },

  getOne: async (workspaceUid: string, projectUid: string): Promise<OrgProject> => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects/${projectUid}`);
  },

  create: async (workspaceUid: string, data: CreateProjectDto): Promise<OrgProject> => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (workspaceUid: string, projectUid: string, data: Partial<CreateProjectDto>): Promise<OrgProject> => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects/${projectUid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (workspaceUid: string, projectUid: string) => {
    return await apiFetch(`/org-companies/${workspaceUid}/projects/${projectUid}`, {
      method: "DELETE",
    });
  },
};