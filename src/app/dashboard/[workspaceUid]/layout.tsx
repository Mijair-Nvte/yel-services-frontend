"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/store/workspace.store";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { workspace, loadWorkspace, loading } = useWorkspaceStore();

  useEffect(() => {
    if (workspaceUid) {
      loadWorkspace(workspaceUid);
    }
  }, [workspaceUid]);

  // ⏳ Loading
  if (loading) {
    return <div className="p-6">Loading workspace...</div>;
  }

  // 🚫 No acceso o no existe
  if (!workspace) {
    router.push("/workspaces");
    return null;
  }

  // ✅ Workspace válido
  return <div className="p-5 flex flex-col gap-4">{children}</div>;
}
