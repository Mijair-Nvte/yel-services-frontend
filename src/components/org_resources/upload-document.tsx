"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function UploadDocument({
  onUpload,
}: {
  onUpload: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onUpload(file);
            e.target.value = ""; // 👈 permite volver a subir el mismo archivo
          }
        }}
      />

      <Button
        size="sm"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Subir archivo
      </Button>
    </>
  );
}
