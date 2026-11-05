"use client";

import React from "react";
import { useWorkspaceStore } from "@/store/workspace.store";

export default function ContentPlanningPage() {
  const { workspace } = useWorkspaceStore();

  return (
    <div className="flex flex-col w-full h-full min-h-screen p-6 bg-background">
      

      {/* Contenedor del Iframe */}
      <div className="flex-1 w-full bg-white border rounded-xl shadow-sm overflow-hidden">
        <iframe
          src="/estrategia-noviembre-2026.html"
          className="w-full h-[85vh]"
          title="Módulo de Planeaciones de Contenido"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
}