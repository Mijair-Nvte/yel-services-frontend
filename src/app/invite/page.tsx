import { Suspense } from "react";
import InviteClient from "./invite-client";

export const dynamic = "force-dynamic";

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-muted-foreground">
          Procesando invitación…
        </p>
      }
    >
      <InviteClient />
    </Suspense>
  );
}
