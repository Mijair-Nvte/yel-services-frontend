"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InviteClient() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");

    if (!token) return;

    // guardar token para registro
    localStorage.setItem("invite_token", token);

    router.push(`/signup/invite?token=${token}`);
  }, [params, router]);

  return <p>Procesando invitación...</p>;
}
