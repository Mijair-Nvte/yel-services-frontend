import { apiFetch } from "./http";

export const AuthService = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    apiFetch("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyRegisterOtp: (payload: { user_id: number; otp: string; workspace_uid: string }) =>
    apiFetch("/partner/register/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    apiFetch("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyOtp: (payload: { user_id: number; otp: string }) =>
    apiFetch("/login/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  requestVerification: (payload: { email: string }) =>
    apiFetch("/auth/request-verification", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => apiFetch("/me"),

  logout: () =>
    apiFetch("/logout", {
      method: "POST",
    }),

    forgotPassword: (payload: { email: string }) =>
        apiFetch("/forgot-password", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    resetPassword: (payload: {
        user_id: number;
        otp: string;
        password: string;
        password_confirmation: string;
    }) =>
        apiFetch("/reset-password", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

        
};
