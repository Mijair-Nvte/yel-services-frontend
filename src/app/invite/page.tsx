import { Suspense } from "react";
import InviteClient from "./invite-client";

export default function InvitePage() {
  return (
    <Suspense fallback={<p>Procesando invitación...</p>}>
      <InviteClient />
    </Suspense>
  );
}
