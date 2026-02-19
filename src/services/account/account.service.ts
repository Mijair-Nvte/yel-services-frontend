import { apiFetch } from "@/services/http";

export const AccountService = {
  me: () => apiFetch("/account"),

  update: (payload: any) =>
    apiFetch("/account", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  uploadAvatar: async (file: File) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null;

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/account/avatar`,
      {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    return res.json();
  },
};
