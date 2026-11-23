"use client";

import React from "react";
import { useWorkspaceStore } from "@/store/workspace.store";

export default function ProjectsPage() {
  const { workspace } = useWorkspaceStore();

  return (
    <div className="flex flex-col w-full h-full min-h-screen p-6 bg-background">
      

      {/* Contenedor del Iframe */}
      <div className="flex-1 w-full bg-white border rounded-xl shadow-sm overflow-hidden">
        <iframe
          src="/Plan90_Kenneth.html"
          className="w-full h-[85vh]"
          title="Módulo de Proyectos"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
}