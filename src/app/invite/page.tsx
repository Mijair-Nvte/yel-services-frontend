"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InvitePage() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  useEffect(() => {
    if (!token) return;

    // guardar token para registro
    localStorage.setItem("invite_token", token);

    router.push("/signup");
  }, [token]);

  return <p>Procesando invitación...</p>;
}
