"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useOrgLinks } from "@/hooks/org_links/use-org-links";
import { OrgLinkService } from "@/services/org_links/org-link.service";

import { LinkHeader } from "@/components/org_links/link-header";
import { LinkList } from "@/components/org_links/link-list";
import { LinkSheet } from "@/components/org_links/link-sheet";

import { Input } from "@/components/ui/input";

import { Search, X } from "lucide-react";

export default function LinksPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { links, loading, reload, removeLink } = useOrgLinks(workspaceUid);

  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any | null>(null);

  // ✅ SEARCH STATE
  const [query, setQuery] = useState("");

  // ✅ FILTERED LINKS
  const filteredLinks = useMemo(() => {
    if (!query.trim()) return links;

    return links.filter((link) =>
      `${link.title} ${link.url}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [links, query]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <LinkHeader
        onCreate={() => {
          setEditingLink(null);
          setOpen(true);
        }}
      />

      {/* ✅ SEARCH BAR PRO */}
      <div className="relative max-w-md">
        {/* ICON LEFT */}
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

        {/* INPUT */}
        <Input
          placeholder="Buscar enlace..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
        />

        {/* ❌ CLEAR BUTTON */}
        {query.trim().length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando enlaces…</div>
      ) : filteredLinks.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No se encontraron enlaces con “{query}”.
        </div>
      ) : (
        <LinkList
          links={filteredLinks}
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
