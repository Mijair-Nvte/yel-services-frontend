"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { InviteSignupForm } from "@/components/Auth/signup/invite-signup-form";

export default function InviteClient() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <InviteSignupForm token={token} />
      </div>
    </div>
  );
}
