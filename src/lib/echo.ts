import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<any> | null = null;
let currentToken: string | null = null;

export function getEcho() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("auth_token");

  if (!token) return null;

  // 🔥 SI CAMBIA TOKEN → RECREAR ECHO
  if (echo && currentToken !== token) {
    echo.disconnect();
    echo = null;
  }

  if (!echo) {
    currentToken = token;

    window.Pusher = Pusher;

    echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,

      authorizer: (channel: any) => {
        return {
          authorize: async (socketId: string, callback: any) => {
            try {
              const API_URL = process.env.NEXT_PUBLIC_API_URL!;

              const res = await fetch(`${API_URL}/broadcasting/auth`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name,
                }),
              });

              const data = await res.json();
              callback(false, data);
            } catch (error) {
              callback(true, error);
            }
          },
        };
      },
    });
  }

  return echo;
}