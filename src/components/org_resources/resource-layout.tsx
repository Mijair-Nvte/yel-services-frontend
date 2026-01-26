"use client";

import { Button } from "@/components/ui/button";
import { FolderDialog } from "./folder-dialog";
import { FolderList } from "./folder-list";
import { ResourceBreadcrumb } from "./breadcrumb";
import { UploadDocument } from "./upload-document";
import { DocumentList } from "./document-list";
import { Plus } from "lucide-react";

export function ResourceLayout({ browser }: { browser: any }) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <ResourceBreadcrumb
          folderStack={browser.folderStack}
          onRoot={browser.goRoot}
          onNavigate={browser.goToFolder}
        />

        <div className="flex items-center gap-2">
          {/* Subir documento SOLO si hay carpeta abierta */}
          {browser.currentFolder && (
            <UploadDocument onUpload={browser.uploadDocument} />
          )}

          {/* Crear carpeta */}
          <FolderDialog
            title="Nueva carpeta"
            onSubmit={browser.createFolder}
            trigger={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva carpeta
              </Button>
            }
          />
        </div>
      </div>

      {/* CONTENIDO */}
      {browser.loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : (
        <div className="space-y-8">
          {/* 📂 CARPETAS */}
          <FolderList
            folders={browser.folders}
            onOpen={browser.openFolder}
            onRename={browser.renameFolder}
            onDelete={browser.deleteFolder}
          />

          {/* 📄 DOCUMENTOS (solo dentro de carpeta) */}
          {browser.currentFolder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Documentos en “{browser.currentFolder.name}”
                </h3>
              </div>

              <DocumentList
                documents={browser.documents}
                onDelete={browser.deleteDocument}
                onDownload={(doc) =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.uid}/download`,
                    "_blank",
                  )
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
