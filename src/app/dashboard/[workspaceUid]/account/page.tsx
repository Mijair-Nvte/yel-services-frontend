"use client";

import { AccountHeader } from "@/components/account/account-header";
import { AccountForm } from "@/components/account/account-form";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10">
      <AccountHeader />
      <AccountForm />
    </div>
  );
}
