
"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useOrgLinks } from "@/hooks/org_links/use-org-links";
import { OrgLinkService } from "@/services/org_links/org-link.service";
import { LinkHeader } from "@/components/org_links/link-header";
import { LinkList } from "@/components/org_links/link-list";
import { LinkSheet } from "@/components/org_links/link-sheet";
import { Input } from "@/components/ui/input";
import { Search, X, Link2 } from "lucide-react";

export default function LinksPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { links, loading, reload, removeLink } = useOrgLinks(workspaceUid);
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any | null>(null);
  const [query, setQuery] = useState("");

  const filteredLinks = useMemo(() => {
    if (!query.trim()) return links;
    return links.filter((link) =>
      `${link.title} ${link.url}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [links, query]);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      {/* HEADER - Usamos la misma lógica de bordes nítidos */}
      <LinkHeader
        onCreate={() => {
          setEditingLink(null);
          setOpen(true);
        }}
      />

      {/* SEARCH BAR - Estilo minimalista nítido */}
      <div className="relative w-full max-w-xl group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-muted-foreground group-focus-within:text-blue-600 transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <Input
          placeholder="Buscar en la base de enlaces..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-10 h-12 bg-white dark:bg-slate-950 border-border/60 rounded-xl focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-all shadow-sm"
        />
        {query.trim().length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* LIST SECTION */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground animate-pulse">
            <Link2 className="h-4 w-4" /> Cargando directorio de enlaces...
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border/60 bg-slate-50/50 dark:bg-slate-900/20">
            <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-bold text-muted-foreground">
              No se encontraron resultados para "{query}"
            </p>
            <button onClick={() => setQuery("")} className="text-xs text-blue-600 font-bold uppercase mt-2 hover:underline">
              Limpiar búsqueda
            </button>
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
            await OrgLinkService.update(workspaceUid,editingLink.uid, data);
          } else {
            await OrgLinkService.create(workspaceUid, data);
          }
          await reload();
        }}
      />
    </div>
  );
}