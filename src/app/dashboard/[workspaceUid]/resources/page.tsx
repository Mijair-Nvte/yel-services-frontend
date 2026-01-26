// src/app/dashboard/[workspaceUid]/resources/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useResourceBrowser } from "@/hooks/org_resources/use-resource-browser";
import { ResourceLayout } from "@/components/org_resources/resource-layout";

export default function CompanyResourcesPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const browser = useResourceBrowser({
    folderableType: "company",
    folderableUid: workspaceUid,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Recursos generales</h1>
        <p className="text-sm text-muted-foreground">
          Documentos y carpetas de la compañía
        </p>
      </div>

      <ResourceLayout browser={browser} />
    </div>
  );
}
