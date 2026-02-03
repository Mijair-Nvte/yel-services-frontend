"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { useOrgLinks } from "@/hooks/org_links/use-org-links";
import { OrgLinkService } from "@/services/org_links/org-link.service";

import { LinkHeader } from "@/components/org_links/link-header";
import { LinkList } from "@/components/org_links/link-list";
import { LinkSheet } from "@/components/org_links/link-sheet";

export default function LinksPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { links, loading, reload, removeLink } = useOrgLinks(workspaceUid);

  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <LinkHeader
        onCreate={() => {
          setEditingLink(null);
          setOpen(true);
        }}
      />

      {/* LIST */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando enlaces…</div>
      ) : (
        <LinkList
          links={links}
          onDelete={removeLink}
          onEdit={(link) => {
            setEditingLink(link);
            setOpen(true);
          }}
        />
      )}

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
            await OrgLinkService.update(editingLink.uid, data);
          } else {
            await OrgLinkService.create(workspaceUid, data);
          }

          await reload();
        }}
      />
    </div>
  );
}
