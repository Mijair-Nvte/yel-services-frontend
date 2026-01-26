import { create } from "zustand";
import { apiFetch } from "@/services/http";

type Area = {
  id: number;
  name: string;
  slug: string;
};

type Workspace = {
  uid: string;
  name: string;
  description?: string;
  areas: Area[];
};

type WorkspaceState = {
  workspace: Workspace | null;
  loading: boolean;
  loadWorkspace: (uid: string) => Promise<void>;
  clearWorkspace: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: null,
  loading: true,

  loadWorkspace: async (uid) => {
    set({ loading: true });

    try {
      const data = await apiFetch(`/org-companies/${uid}`);
      set({ workspace: data });
    } catch {
      set({ workspace: null });
    } finally {
      set({ loading: false });
    }
  },

  clearWorkspace: () => set({ workspace: null }),
}));
