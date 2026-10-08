"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X, FileText, Film, Image as ImageIcon, Trash2 } from "lucide-react";

interface MediaUploaderProps {
  value?: string | File | null;
  onChange: (file: File | null) => void;
  label?: string;
  description?: string;
  accept?: string;
  type?: 'image' | 'video' | 'document';
}

export function MediaUploader({
  value,
  onChange,
  label = "Subir archivo",
  description = "Arrastra un archivo o haz clic para seleccionarlo",
  accept = "image/*",
  type = "image",
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = React.useMemo(() => {
    if (!value) return null;
    if (typeof value === "string") return value;
    try {
      return URL.createObjectURL(value);
    } catch (e) {
      return null;
    }
  }, [value]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onChange(e.dataTransfer.files[0]);
      }
    },
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </p>
      )}

      <div
        className={`relative group rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out ${
          dragActive
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
            : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
        } ${previewUrl ? "border-none p-0 overflow-hidden shadow-sm" : "p-6 text-center"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200">
            {type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
            )}

            {type === "video" && (
              <video 
                src={previewUrl} 
                controls 
                preload="metadata"
                className="w-full h-full object-contain" 
              />
            )}

            {type === "document" && (
              <div className="flex flex-col items-center text-slate-300 p-4">
                <FileText className="h-12 w-12 text-indigo-400 mb-2" />
                <span className="text-xs truncate max-w-xs">
                  {typeof value === "object" && value instanceof File ? value.name : "Archivo cargado"}
                </span>
              </div>
            )}

            {/* Botón flotante sutil en la esquina superior derecha para eliminar/cambiar */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm transition-all shadow-md z-20 flex items-center justify-center group/btn"
              title="Eliminar o cambiar archivo"
            >
              <Trash2 className="h-4 w-4 text-slate-200 group-hover/btn:text-white" />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-4">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {type === "video" ? (
                <Film className="h-6 w-6 text-indigo-500" />
              ) : type === "document" ? (
                <FileText className="h-6 w-6 text-indigo-500" />
              ) : (
                <ImageIcon className="h-6 w-6 text-indigo-500" />
              )}
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Haz clic o arrastra tu archivo aquí
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}