import { create } from "zustand";
import { AuthService } from "@/services/auth.service";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  investor_tier?: { name: string; color: string } | null;
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

  register: (payload: any) => Promise<void>;
  verifyRegisterOtp: (otp: string, workspaceUid: string) => Promise<void>;

  cancelLogin: () => void;
  logout: () => Promise<void>;

  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (payload: { otp: string; password: string; password_confirmation: string }) => Promise<void>;
  cancelReset: () => void;

};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
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


  register: async (payload) => {
    try {
      const res = await AuthService.register(payload);
      set({
        requiresOtp: true,
        tempUserId: res.user_id,
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Error al crear la cuenta";
      throw new Error(errorMessage);
    }
  },


  verifyRegisterOtp: async (otp: string, workspaceUid: string) => {
    const { tempUserId } = get();
    if (!tempUserId) throw new Error("No hay usuario temporal para verificar");

    const res = await AuthService.verifyRegisterOtp({
      user_id: tempUserId,
      otp,
      workspace_uid: workspaceUid
    });

    localStorage.setItem("auth_token", res.token);
    const me = await AuthService.me();

    set({
      token: res.token,
      user: me.user,
      requiresOtp: false,
      tempUserId: null,
    });
  },

  // ✅ login guarda token y carga usuario
  login: async ({ email, password }) => {
    try {
      const res = await AuthService.login({ email, password });
      set({
        requiresOtp: true,
        tempUserId: res.user_id
      });
    } catch (error: any) {
      // ✅ Como usas fetch y lanzas `data`, el error es directamente el JSON del backend
      const msg = error?.message || "Error al iniciar sesión";
      const needsVerificationFlag = error?.needs_verification;

      // ✅ Validamos por el flag del JSON o si el texto menciona "verific"
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

    // Aquí sí guardamos el token final
    localStorage.setItem("auth_token", res.token);
    const me = await AuthService.me();

    set({
      token: res.token,
      user: me.user,
      requiresOtp: false, // Ocultamos formulario OTP
      tempUserId: null,   // Limpiamos temporal
    });
  },

  cancelLogin: () => set({ requiresOtp: false, tempUserId: null }),

  // ✅ logout limpia todo
  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      localStorage.removeItem("auth_token");
      set({ token: null, user: null, loading: false, requiresOtp: false, tempUserId: null });
    }
  },

  requestPasswordReset: async (email: string) => {
    const res = await AuthService.forgotPassword({ email });
    set({
      requiresOtp: true,
      tempUserId: res.user_id, // Asumiendo que tu backend devuelve { message: "...", user_id: X }
    });
  },
  confirmPasswordReset: async ({ otp, password, password_confirmation }) => {
    const { tempUserId } = get();
    if (!tempUserId) throw new Error("No hay un usuario temporal para verificar");

    await AuthService.resetPassword({
      user_id: tempUserId,
      otp,
      password,
      password_confirmation,
    });

    // Limpiamos el estado al terminar
    set({
      requiresOtp: false,
      tempUserId: null,
    });
  },
  cancelReset: () => set({ requiresOtp: false, tempUserId: null }),

}));
