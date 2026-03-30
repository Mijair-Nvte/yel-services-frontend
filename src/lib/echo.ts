"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo: Echo | null = null;

export function getEcho() {
  if (!echo && typeof window !== "undefined") {
    window.Pusher = Pusher;

    const token = localStorage.getItem("auth_token");

    echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,

      authEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/broadcasting/auth`,

      // ✅ FIX: evitar token null
      auth: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });
  }

  return echo;
}