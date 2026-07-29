"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useOrgLinks } from "@/hooks/org_links/use-org-links";
import { OrgLinkService } from "@/services/org_links/org-link.service";
import { LinkHeader } from "@/components/org_links/link-header";
import { LinkTable } from "@/components/org_links/link-list";
import { LinkSheet } from "@/components/org_links/link-sheet";
import { Input } from "@/components/ui/input";
import { Search, X, Link2 } from "lucide-react";

export default function LinksPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { links, loading, reload, removeLink } = useOrgLinks(workspaceUid);
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any | null>(null);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      {/* HEADER - Usamos la misma lógica de bordes nítidos */}
      <LinkHeader
        onCreate={() => {
          setEditingLink(null);
          setOpen(true);
        }}
      />

      {/* LIST SECTION */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground animate-pulse">
            <Link2 className="h-4 w-4" /> Cargando directorio de enlaces...
          </div>
        ) : (
          <LinkTable
            links={links}
            onDelete={removeLink}
            onEdit={(link) => {
              setEditingLink(link);
              setOpen(true);
            }}
          />
        )}
      </div>

      {/* SHEET */}
      <LinkSheet
        open={open}
        link={editingLink}
        onClose={() => {
          setOpen(false);
          setEditingLink(null);
        }}
        onSubmit={async (data) => {
          if (editingLink) {
            await OrgLinkService.update(workspaceUid, editingLink.uid, data);
          } else {
            await OrgLinkService.create(workspaceUid, data);
          }
          await reload();
        }}
      />
    </div>
  );
}
