// C:\YEL\yel-services-frontend\src\store\workspace.store.ts

import { create } from "zustand";
import { apiFetch } from "@/services/http";
import { WorkspaceService } from "@/services/workspace.service"; // Asegúrate de importar el servicio

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

  isOwner: boolean;
  roles: string[];
  permissions: string[];
  loadingPermissions: boolean;

  loadWorkspace: (uid: string) => Promise<void>;
  clearWorkspace: () => void;
  hasPermission: (permission: string) => boolean; // Utilidad para componentes
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspace: null,
  loading: true,
  isOwner: false,
  roles: [],
  permissions: [],
  loadingPermissions: true,

  loadWorkspace: async (uid) => {
    set({ loading: true, loadingPermissions: true });

    try {
      // Puedes lanzar ambas peticiones al mismo tiempo para que sea más rápido
      const [workspaceData, permissionsData] = await Promise.all([
        apiFetch(`/org-companies/${uid}`),
        WorkspaceService.getMyPermissions(uid)
      ]);

      set({
        workspace: workspaceData,
        isOwner: permissionsData.is_owner || false,
        roles: permissionsData.roles || [],
        permissions: permissionsData.permissions || []
      });
    } catch (error) {
      console.error("Error cargando workspace o permisos", error);
      set({ workspace: null, roles: [], permissions: [] });
    } finally {
      set({ loading: false, loadingPermissions: false });
    }
  },

  clearWorkspace: () => set({
    workspace: null,
    isOwner: false,
    roles: [],
    permissions: [],
    loadingPermissions: false
  }),

  // Función ayudante que usarás en tus vistas
  hasPermission: (permission: string) => {
    const state = get();

    // ✅ LA MAGIA: Si el usuario es el Owner, tiene acceso total a todo.
    // Ignora el arreglo de permisos de Spatie y retorna true.
    if (state.isOwner) {
      return true;
    }

    // Si no es owner, verifica sus permisos normales
    return state.permissions.includes(permission);
  },
}));