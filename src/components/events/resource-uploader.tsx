"use client";

import React from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface ResourceItem {
  id?: string;
  title: string;
  file?: File | null;
  url?: string;
  type?: string;
  isUrl?: boolean; // 👈 Bandera explícita para el toggle
}

interface ResourceUploaderProps {
  resources: ResourceItem[];
  onChange: (resources: ResourceItem[]) => void;
  label?: string;
  description?: string;
}

export function ResourceUploader({
  resources,
  onChange,
  label = "Guías y Recursos Descargables",
  description = "Archivos que los usuarios podrán descargar al registrarse.",
}: ResourceUploaderProps) {

  const handleAddResource = () => {
    onChange([
      ...resources, 
      { title: "", file: null, url: "", type: "pdf", isUrl: false }
    ]);
  };

  const handleRemoveResource = (index: number) => {
    const updated = resources.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (index: number, field: keyof ResourceItem, value: any) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  // Controlador exacto del Switch
  const handleToggleChange = (index: number, checked: boolean) => {
    const updated = [...resources];
    updated[index] = {
      ...updated[index],
      isUrl: checked,
      // Si activa URL, borramos el archivo. Si desactiva URL, borramos el texto de la URL.
      file: checked ? null : updated[index].file,
      url: checked ? updated[index].url : "",
    };
    onChange(updated);
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold text-slate-800 dark:text-slate-100">{label}</Label>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddResource}
          className="bg-white dark:bg-slate-800 hover:bg-slate-100"
        >
          <Plus className="h-4 w-4 mr-1 text-indigo-500" /> Añadir recurso
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <FileText className="h-8 w-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">No hay recursos agregados todavía.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((res, index) => {
            // Evaluamos la bandera explícita, respaldada si ya traía URL de base de datos
            const isUrlMode = res.isUrl ?? Boolean(res.url && !res.file);

            return (
              <div
                key={index}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs relative group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-slate-500">Título del Recurso / Guía</Label>
                    <Input
                      placeholder="Ej: Guía de Inversión 2026.pdf"
                     value={res.title || ""}
                      onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 self-end mb-0.5"
                    onClick={() => handleRemoveResource(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Switch controlado de manera explícita */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                  <Label className="text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                    ¿Vincular mediante URL externa?
                  </Label>
                  <Switch
                    checked={isUrlMode}
                    onCheckedChange={(checked) => handleToggleChange(index, checked)}
                  />
                </div>

                {/* Renderizado condicional basado en la bandera isUrlMode */}
                {!isUrlMode ? (
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const selectedFile = e.target.files[0];
                          const rawName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;

                          const updated = [...resources];
                          updated[index] = {
                            ...updated[index],
                            file: selectedFile,
                            url: "",
                            title: updated[index].title || rawName
                          };
                          onChange(updated);
                        }
                      }}
                      className="text-xs file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {res.file && res.file instanceof File && (
                      <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                        Archivo seleccionado: {res.file.name}
                      </p>
                    )}
                    {res.url && !res.file && (
                      <p className="text-[11px] text-indigo-600 mt-1 font-medium">
                        Archivo actual registrado en servidor.
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/documento.pdf"
                      value={res.url || ""}
                      onChange={(e) => handleFieldChange(index, "url", e.target.value)}
                      className="text-xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Ingresa el enlace web directo al recurso.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}