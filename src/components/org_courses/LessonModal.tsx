"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { OrgCourseLesson } from "@/services/org-course/org-course.service";
import { MediaUploader } from "@/components/ui/MediaUploader";

interface LessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; is_free_preview: boolean }, file: File | null) => void;
    isSubmitting: boolean;
    uploadingStatus: string;
    initialData?: OrgCourseLesson & { video_url?: string | null } | null;
}

export function LessonModal({ isOpen, onClose, onSubmit, isSubmitting, uploadingStatus, initialData }: LessonModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isFreePreview, setIsFreePreview] = useState(false);
    
    // Ahora aceptamos File, string (la URL firmada que viene del accessor) o null
    const [lessonFile, setLessonFile] = useState<File | string | null>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || "");
            setIsFreePreview(initialData.is_free_preview);
            // Si tiene video previo, cargamos la URL firmada (video_url) o en su defecto el path
            setLessonFile(initialData.video_url || initialData.video_path || null);
        } else {
            setTitle("");
            setDescription("");
            setIsFreePreview(false);
            setLessonFile(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Si el usuario dejó la URL existente (string), enviamos null como archivo para que el padre sepa que no se subió uno nuevo
        const fileToSubmit = lessonFile instanceof File ? lessonFile : null;
        onSubmit({ title, description, is_free_preview: isFreePreview }, fileToSubmit);
    };

    const isDisabled = isSubmitting || !!uploadingStatus;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {initialData ? "Editar Lección" : "Agregar Lección al Módulo"}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600" disabled={isDisabled}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="les_title">Título de la Lección</Label>
                        <Input
                            id="les_title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Conceptos básicos de bienes raíces"
                            disabled={isDisabled}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="les_desc">Descripción (Opcional)</Label>
                        <Textarea
                            id="les_desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Material de apoyo, texto o resumen..."
                            className="resize-none min-h-[90px]"
                            disabled={isDisabled}
                        />
                    </div>

                    {/* Componente unificado MediaUploader para video privado de la lección */}
                    <div className="space-y-2">
                        <MediaUploader
                            label="Video de la Lección (Bucket Privado)"
                            description="MP4, MOV o WEBM hasta 500MB"
                            accept="video/mp4,video/quicktime,video/webm"
                            type="video"
                            value={lessonFile}
                            onChange={(file) => setLessonFile(file)}
                        />
                    </div>

                    <div className="flex flex-row items-center justify-between rounded-xl border p-4 border-slate-200">
                        <div className="space-y-0.5">
                            <Label className="text-base cursor-pointer" htmlFor="is_free_preview">Lección de Muestra (Gratis)</Label>
                            <p className="text-[13px] text-slate-500">
                                Permite que los usuarios no registrados vean este video como promoción.
                            </p>
                        </div>
                        <Switch
                            id="is_free_preview"
                            checked={isFreePreview}
                            onCheckedChange={setIsFreePreview}
                            disabled={isDisabled}
                        />
                    </div>

                    {uploadingStatus && (
                        <div className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg animate-pulse border border-indigo-100">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {uploadingStatus}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isDisabled}>Cancelar</Button>
                        <Button type="submit" disabled={isDisabled || !title} className="bg-indigo-600 hover:bg-indigo-700">
                            {uploadingStatus || isSubmitting ? "Procesando..." : (initialData ? "Actualizar Lección" : "Guardar Lección")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}