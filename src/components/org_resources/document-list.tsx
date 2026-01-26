"use client";

import { FileText, Trash, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentList({
  documents,
  onDelete,
  onDownload,
}: {
  documents: any[];
  onDelete: (doc: any) => void;
  onDownload: (doc: any) => void;
}) {
  if (!documents.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay documentos en esta carpeta.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{doc.title}</p>
              <p className="text-xs text-muted-foreground">
                {(doc.file_size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.uid}/view`,
                  "_blank",
                )
              }
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => onDownload(doc)}>
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-red-600"
              onClick={() => {
                if (confirm("¿Eliminar este documento?")) {
                  onDelete(doc);
                }
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
