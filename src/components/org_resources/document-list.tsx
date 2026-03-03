"use client";

import { FileText, Trash, Download, File, Image as ImageIcon, FileArchive, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

// Función mamalona para mostrar un ícono diferente según el tipo de archivo
const getFileIcon = (fileName: string, mimeType?: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (mimeType?.startsWith('image/') || ['jpeg', 'jpg', 'png', 'gif', 'svg'].includes(extension)) {
    return <ImageIcon className="h-5 w-5 text-blue-500" />;
  }
  if (mimeType?.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
    return <Video className="h-5 w-5 text-purple-500" />;
  }
  if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(extension)) {
    return <Music className="h-5 w-5 text-yellow-500" />;
  }
  if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
    return <FileArchive className="h-5 w-5 text-orange-500" />;
  }
  
  return <FileText className="h-5 w-5 text-blue-500" />;
};

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
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted rounded-xl bg-muted/20">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <File className="h-6 w-6 text-muted-foreground opacity-50" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Esta carpeta está vacía
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Sube un documento para empezar
        </p>
      </div>
    );
  }

  const handleView = (uid: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/documents/${uid}/view`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => handleView(doc.uid)}
          className="group flex items-center justify-between p-3 border rounded-xl bg-background hover:bg-accent/40 hover:border-blue-200/60 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        >
          {/* Lado Izquierdo: Icono e Info (Clickable) */}
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50/50 group-hover:bg-blue-100/50 transition-colors">
              {getFileIcon(doc.title, doc.mime_type)}
            </div>
            
            <div className="flex flex-col flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                {doc.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-muted-foreground font-medium">
                  {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                </p>
                <span className="text-muted-foreground/30 text-[10px]">•</span>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {doc.title.split('.').pop()?.substring(0, 4) || 'FILE'}
                </p>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Acciones Ocultas (Aparecen en Hover) */}
          <div 
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            // 👇 ESTO ES LO QUE EVITA QUE SE ABRA EL ARCHIVO AL DAR CLIC EN LOS BOTONES
            onClick={(e) => e.stopPropagation()} 
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              onClick={() => onDownload(doc)}
              title="Descargar"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              onClick={() => {
                if (confirm("¿Seguro que deseas eliminar este documento?")) {
                  onDelete(doc);
                }
              }}
              title="Eliminar"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}