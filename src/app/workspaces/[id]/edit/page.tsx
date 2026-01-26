"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceForm } from "@/components/workspaces/workspace-form";
import { WorkspaceService } from "@/services/workspace.service";

export default function EditWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<any>(null);

  // En page.tsx
  useEffect(() => {
    WorkspaceService.get(String(id)).then(setWorkspace);
  }, [id]);
  if (!workspace) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Edit workspace</h1>

      <WorkspaceForm
        mode="edit"
        defaultValues={workspace}
        onSubmit={async (data) => {
          await WorkspaceService.update(Number(id), data);
          router.push("/workspaces");
        }}
      />
    </div>
  );
}
