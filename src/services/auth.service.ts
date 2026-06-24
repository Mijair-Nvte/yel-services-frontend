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
};
