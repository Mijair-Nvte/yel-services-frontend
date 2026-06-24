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

  requiresOtp: boolean;
  tempUserId: number | null;

  initializeAuth: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  cancelLogin: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,

  // ✅ siempre inicia cargando
  loading: true,
  requiresOtp: false,
  tempUserId: null,

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
    try {
      const res = await AuthService.login({ email, password });

      // ✅ En lugar de guardar sesión, activamos la vista OTP
      set({
        requiresOtp: true,
        tempUserId: res.user_id
      });
    } catch (error: any) {
      // ✅ Validamos si es un error de cuenta no verificada
      const msg = error?.message || "Error al iniciar sesión";
      const needsVerificationFlag = error?.needs_verification;

      if (needsVerificationFlag || msg.toLowerCase().includes('verific')) {
        throw {
          isVerificationRequired: true,
          message: msg
        };
      }
      throw error;
    }
  },

  verifyOtp: async (otp: string) => {
    const { tempUserId } = get();
    if (!tempUserId) throw new Error("No hay usuario temporal para verificar");

    const res = await AuthService.verifyOtp({ user_id: tempUserId, otp });

    // ✅ Aquí sí guardamos el token final
    localStorage.setItem("auth_token", res.token);
    const me = await AuthService.me();

    set({
      token: res.token,
      user: me.user,
      requiresOtp: false,
      tempUserId: null,
    });
  },

  cancelLogin: () => set({ requiresOtp: false, tempUserId: null }),


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
        requiresOtp: false,
        tempUserId: null
      });
    }
  },
}));
