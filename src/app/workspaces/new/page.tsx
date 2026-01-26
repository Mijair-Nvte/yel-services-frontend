"use client";

import { WorkspaceForm } from "@/components/workspaces/workspace-form";
import { WorkspaceService } from "@/services/workspace.service";
import { useRouter } from "next/navigation";

export default function CreateWorkspacePage() {
  const router = useRouter();

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Crear espacio</h1>

      <WorkspaceForm
        mode="create"
        onSubmit={async (data) => {
          await WorkspaceService.create(data);
          router.push("/workspaces");
        }}
      />
    </div>
  );
}
