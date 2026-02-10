// src/app/signup/invite/page.tsx
import { InviteSignupForm } from "@/components/Auth/signup/invite-signup-form";

export default function InviteSignupPage() {
  return (
  <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <InviteSignupForm />
      </div>
    </div>
  );
}
