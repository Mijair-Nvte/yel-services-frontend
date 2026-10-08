"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Info, DollarSign } from "lucide-react";

import { OrgCourse, CreateCourseDto, OrgCourseService } from "@/services/org-course/org-course.service";
import { apiFetch } from "@/services/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MediaUploader } from "@/components/ui/MediaUploader";

interface CourseFormProps {
  workspaceUid: string;
  initialData?: OrgCourse | null;
}

export function CourseForm({ workspaceUid, initialData }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState("");

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    status: initialData?.status || "draft",
    is_active: initialData?.is_active ?? true,
    is_free: initialData?.is_free ?? true,
    price: initialData?.price || 0,
    revenuecat_entitlement_id: initialData?.revenuecat_entitlement_id || "",
    cover_image_url: initialData?.cover_image_url || "",
    preview_video_url: initialData?.preview_video_url || "",
  });

  const [coverFile, setCoverFile] = useState<File | string | null>(initialData?.cover_url || initialData?.cover_image_url || null);
  const [previewFile, setPreviewFile] = useState<File | string | null>(initialData?.preview_url || initialData?.preview_video_url || null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!initialData && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, initialData]);

  // Pasamos explicitamente el currentCourseUid a la función
  const uploadFileToR2 = async (file: File, type: 'cover' | 'preview', currentCourseUid: string): Promise<string> => {
    const presignData = await apiFetch(`/org-companies/${workspaceUid}/courses/presign`, {
      method: "POST",
      body: JSON.stringify({
        file_name: file.name,
        mime_type: file.type,
        type: type,
        course_uid: currentCourseUid, // Ahora siempre enviará un UID real
      }),
    });

    const { upload_url, path } = presignData;

    const uploadResponse = await fetch(upload_url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) throw new Error(`Error al subir el archivo (${type}).`);

    return path;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("El título y el slug son obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      let isNewCourse = !initialData;
      let currentCourseUid = initialData?.uid;

      // PASO 1: SI ES NUEVO, CREAR EL CURSO PRIMERO PARA OBTENER EL UID
      if (isNewCourse) {
        setUploadingStatus("Creando curso base...");
        const newCourse = await OrgCourseService.create(workspaceUid, {
          ...formData,
          cover_image_url: "", // Lo mandamos vacío temporalmente
          preview_video_url: "",
        } as CreateCourseDto);

        // Dependiendo de la estructura de respuesta de tu API (puede ser newCourse.uid o newCourse.data.uid)
        currentCourseUid = newCourse.uid || newCourse.data?.uid;
      }

      if (!currentCourseUid) throw new Error("No se pudo obtener el identificador del curso.");

      // PASO 2: SUBIR LOS ARCHIVOS USANDO EL UID REAL DEL CURSO
      let finalCoverUrl = formData.cover_image_url;
      let finalPreviewUrl = formData.preview_video_url;

      if (coverFile instanceof File) {
        setUploadingStatus("Subiendo imagen de portada...");
        finalCoverUrl = await uploadFileToR2(coverFile, 'cover', currentCourseUid);
      } else if (!coverFile) {
        finalCoverUrl = "";
      } else if (typeof coverFile === "string") {
        try {
          const urlObj = new URL(coverFile);
          finalCoverUrl = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
        } catch {
          finalCoverUrl = coverFile;
        }
      }

      if (previewFile instanceof File) {
        setUploadingStatus("Subiendo video promocional...");
        finalPreviewUrl = await uploadFileToR2(previewFile, 'preview', currentCourseUid);
      } else if (!previewFile) {
        finalPreviewUrl = "";
      } else if (typeof previewFile === "string") {
        try {
          const urlObj = new URL(previewFile);
          finalPreviewUrl = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
        } catch {
          finalPreviewUrl = previewFile;
        }
      }

      // PASO 3: ACTUALIZAR EL CURSO CON LAS URLS DEFINITIVAS
      setUploadingStatus("Guardando información final...");
      const updatePayload = {
        ...formData,
        cover_image_url: finalCoverUrl,
        preview_video_url: finalPreviewUrl,
      };

      // Siempre actualizamos para asentar las URLs
      await OrgCourseService.update(workspaceUid, currentCourseUid, updatePayload);

      toast.success(isNewCourse ? "Curso creado y archivos subidos correctamente." : "Curso actualizado correctamente.");

      // Redirigir asegurando que usamos el currentCourseUid correcto (Evita el error de "no se puede acceder")
      router.push(`/dashboard/${workspaceUid}/courses/${currentCourseUid}`);

    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al procesar el curso.");
    } finally {
      setIsLoading(false);
      setUploadingStatus("");
    }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Columna Principal: Información Básica */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-500" /> Información General
              </CardTitle>
              <CardDescription>Detalles principales y visibilidad del curso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">

              <div className="space-y-2">
                <Label htmlFor="title">Título del Curso</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Máster en Inversiones Inmobiliarias"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL amigable)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="master-inversiones"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    disabled={isLoading}
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as "draft" | "published" | "archived" }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe brevemente el objetivo y contenido del curso..."
                  className="min-h-[140px] resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Toggle de Curso Activo */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 border-slate-200 mt-4">
                <div className="space-y-0.5">
                  <Label className="text-base cursor-pointer" htmlFor="is_active">Curso Activo</Label>
                  <p className="text-[13px] text-slate-500">
                    Determina si el curso está habilitado operativamente en el sistema.
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  disabled={isLoading}
                />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Columna Secundaria: Multimedia y Monetización */}
        <div className="space-y-6">

          {/* Archivos Multimedia */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Archivos Multimedia</CardTitle>
              <CardDescription>Portada y video promocional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <MediaUploader
                label="Imagen de Portada"
                description="PNG, JPG o WEBP hasta 4MB"
                accept="image/jpeg,image/png,image/webp"
                type="image"
                value={coverFile}
                onChange={(file) => setCoverFile(file)}
              />

              <MediaUploader
                label="Video Promocional (Preview)"
                description="MP4, MOV o AVI hasta 50MB"
                accept="video/mp4,video/quicktime,video/avi"
                type="video"
                value={previewFile}
                onChange={(file) => setPreviewFile(file)}
              />
            </CardContent>
          </Card>

          {/* Monetización */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-indigo-500" /> Monetización
              </CardTitle>
              <CardDescription>Configura precios y accesos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

              <div className="flex flex-row items-center justify-between rounded-lg border p-4 border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-base cursor-pointer" htmlFor="is_free">Curso Gratuito</Label>
                  <p className="text-[13px] text-slate-500">
                    Acceso libre para usuarios.
                  </p>
                </div>
                <Switch
                  id="is_free"
                  checked={formData.is_free}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_free: checked }))}
                  disabled={isLoading}
                />
              </div>

              {!formData.is_free && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio Sugerido</Label>
                    <div className="flex items-center gap-2 relative">
                      <DollarSign className="h-4 w-4 text-slate-400 absolute ml-3" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className="pl-9"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenuecat_entitlement_id">RevenueCat Entitlement ID</Label>
                    <Input
                      id="revenuecat_entitlement_id"
                      name="revenuecat_entitlement_id"
                      value={formData.revenuecat_entitlement_id}
                      onChange={handleChange}
                      placeholder="pro_course_access"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Fixed Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div>
          {isLoading && uploadingStatus && (
            <p className="text-xs font-medium text-indigo-600 flex items-center gap-2 animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" /> {uploadingStatus}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => router.push(`/dashboard/${workspaceUid}/courses`)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {initialData ? "Guardar Cambios" : "Crear Curso"}
          </Button>
        </div>
      </div>
    </form>
  );
}