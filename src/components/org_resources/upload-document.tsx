"use client";

import { useRef, useState } from "react";
import { Upload, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UploadDocument({
  onUpload,
}: {
  onUpload: (file: File, onProgress: (p: number) => void) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] =
    useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    setError(null);
  };

  const startUpload = async (file: File) => {
    setStatus("uploading");
    setProgress(0);

    try {
      await onUpload(file, (p) => setProgress(p));
      setStatus("done");
    } catch (e: any) {
      setError("No se pudo subir el archivo");
      setStatus("error");
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;

          setFile(f);
          setOpen(true);
          startUpload(f);

          e.target.value = "";
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

      <Dialog open={open} onOpenChange={(v) => !v && reset()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subiendo archivo</DialogTitle>
          </DialogHeader>

          {file && (
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">{file.name}</p>
                <p className="text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <Progress value={progress} />

              {status === "uploading" && (
                <p className="text-sm text-muted-foreground">
                  Subiendo… {progress}%
                </p>
              )}

              {status === "done" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Archivo subido correctamente
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {(status === "done" || status === "error") && (
                <Button onClick={() => setOpen(false)}>Cerrar</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}