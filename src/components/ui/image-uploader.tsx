"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string | File | null; // Puede ser una URL existente o un nuevo File
  onChange: (file: File | null) => void;
  label?: string;
  description?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = "Subir Imagen",
  description = "PNG, JPG, GIF hasta 2MB",
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  // Obtener URL de vista previa (ya sea de un archivo local o de una URL existente)
  const previewUrl = React.useMemo(() => {
    if (!value) return null;
    if (typeof value === "string") return value; // Es una URL del servidor
    try {
      return URL.createObjectURL(value); // Es un archivo nuevo File
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
    [onChange],
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
        } ${previewUrl ? "border-none p-0 overflow-hidden" : "p-8 text-center"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
            {/* Capa oscura on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110 shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Haz clic o arrastra una imagen
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}
