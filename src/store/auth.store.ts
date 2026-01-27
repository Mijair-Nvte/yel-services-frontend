import { create } from "zustand";
import { AuthService } from "@/services/auth.service";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;

  initializeAuth: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  // ✅ siempre inicia cargando
  loading: true,

  // ✅ se ejecuta una sola vez al arrancar la app
  initializeAuth: async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      set({ token: null, user: null, loading: false });
      return;
    }

    try {
      const res = await AuthService.me();

      set({
        token,
        user: res.user,
        loading: false,
      });
    } catch {
      localStorage.removeItem("auth_token");

      set({
        token: null,
        user: null,
        loading: false,
      });
    }
  },

  // ✅ login guarda token y carga usuario
  login: async ({ email, password }) => {
    const res = await AuthService.login({ email, password });

    localStorage.setItem("auth_token", res.token);

    const me = await AuthService.me();

    set({
      token: res.token,
      user: me.user,
    });
  },

  // ✅ logout limpia todo
  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      localStorage.removeItem("auth_token");

      set({
        token: null,
        user: null,
        loading: false,
      });
    }
  },
}));
