"use client";

import { useState } from "react";
import { Loader2, X, FileText, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrgCourseResource, StoreResourceDto } from "@/services/org-course/org-course.service";
import { MediaUploader } from "@/components/ui/MediaUploader";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

interface ResourceManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceableType: 'course' | 'module' | 'lesson';
    resourceableUid: string;
    parentTitle: string; // Para mostrar "Recursos de: Módulo 1"
    existingResources: OrgCourseResource[];
    isUploading: boolean;
    onUpload: (data: StoreResourceDto, file: File) => Promise<boolean>;
    onDelete: (resourceUid: string) => Promise<boolean>;
}

export function ResourceManagerModal({
    isOpen,
    onClose,
    resourceableType,
    resourceableUid,
    parentTitle,
    existingResources,
    isUploading,
    onUpload,
    onDelete
}: ResourceManagerModalProps) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        const success = await onUpload({
            resourceable_type: resourceableType,
            resourceable_uid: resourceableUid,
            title,
            file_name: file.name,
            file_url: "", // Se asigna en el hook
        }, file);

        if (success) {
            setTitle("");
            setFile(null);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Archivos Adjuntos</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{parentTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                    {/* Lista de Recursos Actuales */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-700">Archivos actuales ({existingResources.length})</h4>
                        {existingResources.length === 0 ? (
                            <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg text-center border border-dashed border-slate-200">
                                No hay archivos adjuntos todavía.
                            </p>
                        ) : (
                            <div className="grid gap-2">
                                {existingResources.map(res => (
                                    <div key={res.uid} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-200 bg-white group transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 shrink-0">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-slate-900 truncate">{res.title}</p>
                                                <p className="text-xs text-slate-500 truncate flex gap-2">
                                                    <span>{res.file_name}</span>
                                                    {res.file_size && <span>• {formatBytes(res.file_size)}</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {res.public_url && (
                                                <a href={res.public_url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            )}
                                            <ConfirmDeleteDialog
                                                title="¿Eliminar archivo?"
                                                description={`Se eliminará permanentemente "${res.title}".`}
                                                onConfirm={() => onDelete(res.uid)}
                                         
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Formulario para Nuevo Recurso */}
                    <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-sm font-medium text-slate-700 mb-4">Adjuntar nuevo archivo</h4>
                        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="space-y-2">
                                <Label htmlFor="res_title">Nombre para mostrar</Label>
                                <Input
                                    id="res_title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Plantilla Excel de Finanzas, PDF Guía 1..."
                                    disabled={isUploading}
                                />
                            </div>

                            <MediaUploader
                                label="Documento o Archivo"
                                description="PDF, ZIP, DOCX, XLSX, etc. (Máx 50MB)"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                                type="document"
                                value={file}
                               onChange={(f) => {
                                    setFile(f);
                                    if (f) {
                                        const nameWithoutExtension = f.name.replace(/\.[^/.]+$/, "");
                                        setTitle(nameWithoutExtension);
                                    }
                                }}
                            />

                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isUploading || !file || !title} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                                    {isUploading ? "Subiendo archivo..." : "Subir Adjunto"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}