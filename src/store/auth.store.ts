import { create } from "zustand";
import { AuthService } from "@/services/auth.service";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  fetchMe: async () => {
    try {
      const res = await AuthService.me();
      set({
        user: res.user,
        isAuthenticated: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      localStorage.removeItem("auth_token");
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
