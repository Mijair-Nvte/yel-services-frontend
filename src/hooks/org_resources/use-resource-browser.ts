// src/hooks/org_resources/use-resource-browser.ts
"use client";

import { useEffect, useState } from "react";
import { FolderService } from "@/services/org_resources/folder.service";
import { DocumentService } from "@/services/org_resources/document.service";

export function useResourceBrowser(params: {
  folderableType: "company" | "area";
  folderableUid: string;
}) {
  const [folders, setFolders] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [folderStack, setFolderStack] = useState<any[]>([]);

  // 📂 cargar raíz
  const loadRoots = async () => {
    setLoading(true);

    const data = await FolderService.roots(params);

    setFolders(data);
    setDocuments([]);
    setCurrentFolder(null);
    setFolderStack([]);

    setLoading(false);
  };

  // 📁 abrir carpeta
  const openFolder = async (folder: any) => {
    setLoading(true);

    const data = await FolderService.children(folder.id);

    setFolders(data.folders);
    setDocuments(data.documents);
    setCurrentFolder(folder);
    setFolderStack((prev) => [...prev, folder]);

    setLoading(false);
  };

  const goToFolder = async (index: number) => {
    const target = folderStack[index];

    setLoading(true);

    const data = await FolderService.children(target.id);

    setFolders(data.folders);
    setDocuments(data.documents);
    setCurrentFolder(target);
    setFolderStack(folderStack.slice(0, index + 1));

    setLoading(false);
  };

  // ➕ subir documento
  const uploadDocument = async (
    file: File,
    onProgress: (p: number) => void
  ) => {
    if (!currentFolder) return;

    // 1️⃣ Presign
    const presign = await DocumentService.presign({
      file,
      folderUid: currentFolder.uid,
    });

    // 2️⃣ Upload con progreso REAL
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () =>
        xhr.status < 300 ? resolve() : reject(new Error("Upload failed"));
      xhr.onerror = () => reject(new Error("Upload error"));

      xhr.open("PUT", presign.upload_url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });

    // 3️⃣ Confirmar
    await DocumentService.confirm({
      folder_uid: currentFolder.uid,
      original_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      key: presign.key,
    });

    await openFolder(currentFolder);
  };
  // 🗑️ eliminar documento
  const deleteDocument = async (doc: any) => {
    await DocumentService.delete(doc.uid);
    await openFolder(currentFolder);
  };

  // ➕ crear carpeta (raíz o hija)
  const createFolder = async (name: string) => {
    await FolderService.create({
      name,
      parent_id: currentFolder?.id ?? null,
      folderableType: params.folderableType,
      folderableUid: params.folderableUid,
    });

    // recargar vista actual
    if (currentFolder) {
      await openFolder(currentFolder);
    } else {
      await loadRoots();
    }
  };

  const renameFolder = async (folder: any, name: string) => {
    await FolderService.rename(folder.id, name);

    currentFolder ? openFolder(currentFolder) : loadRoots();
  };

  const deleteFolder = async (folder: any) => {
    await FolderService.remove(folder.id);

    // Si borras la carpeta actual o una anterior → root
    if (folderStack.find((f) => f.id === folder.id)) {
      loadRoots();
    } else if (currentFolder) {
      openFolder(currentFolder);
    } else {
      loadRoots();
    }
  };

  useEffect(() => {
    if (params.folderableUid) {
      loadRoots();
    }
  }, [params.folderableUid]);

  return {
    folders,
    documents,
    currentFolder,
    folderStack,
    loading,

    openFolder,
    goRoot: loadRoots,
    goToFolder,

    createFolder,
    renameFolder,
    deleteFolder,
    uploadDocument,
    deleteDocument,
  };
}
