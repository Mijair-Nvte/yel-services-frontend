"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { OrgCourseContentService, OrgCourseModule, CreateModuleDto, CreateLessonDto } from "@/services/org-course/org-course.service";

export function useCourseContent(workspaceUid: string, courseUid: string) {
    const [modules, setModules] = useState<OrgCourseModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Cargar todo el temario (módulos y lecciones)
    const loadContent = useCallback(async () => {
        if (!workspaceUid || !courseUid) return;
        setIsLoading(true);
        try {
            const data = await OrgCourseContentService.getContent(workspaceUid, courseUid);
            setModules(data || []);
        } catch (error) {
            toast.error("Error al cargar el contenido del curso.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid, courseUid]);

    // Crear un nuevo módulo
    const createModule = async (data: CreateModuleDto) => {
        setIsCreating(true);
        try {
            await OrgCourseContentService.createModule(workspaceUid, courseUid, data);
            toast.success("Módulo creado correctamente.");
            await loadContent();
            return true;
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error al crear el módulo.");
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    // Actualizar módulo existente
    const updateModule = async (moduleUid: string, data: CreateModuleDto) => {
        setIsCreating(true);
        try {
            await OrgCourseContentService.updateModule(workspaceUid, courseUid, moduleUid, data);
            toast.success("Módulo actualizado correctamente.");
            await loadContent();
            return true;
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error al actualizar el módulo.");
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    // Eliminar módulo y su contenido físico en R2
    const deleteModule = async (moduleUid: string) => {
        try {
            await OrgCourseContentService.deleteModule(workspaceUid, courseUid, moduleUid);
            toast.success("Módulo eliminado correctamente.");
            await loadContent();
            return true;
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error al eliminar el módulo.");
            return false;
        }
    };

    // Crear una nueva lección dentro de un módulo
    const createLesson = async (moduleUid: string, data: CreateLessonDto) => {
        setIsCreating(true);
        try {
            await OrgCourseContentService.createLesson(workspaceUid, courseUid, moduleUid, data);
            toast.success("Lección creada correctamente.");
            await loadContent();
            return true;
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error al crear la lección.");
            return false;
        } finally {
            setIsCreating(false);
        }
    };


    // Reordenar Módulos
    const reorderModules = async (newModules: OrgCourseModule[]) => {
        setModules(newModules); // Actualización optimista de UI instantánea
        try {
            const payload = newModules.map((m, index) => ({ uid: m.uid, sort_order: index + 1 }));
            await OrgCourseContentService.reorderModules(workspaceUid, courseUid, payload);
        } catch (error) {
            toast.error("Error al guardar el orden de los módulos.");
            loadContent(); // Revertir si falla
        }
    };

    // Reordenar Lecciones
    const reorderLessons = async (moduleUid: string, newLessons: any[]) => {
        setModules(prev => prev.map(mod => mod.uid === moduleUid ? { ...mod, lessons: newLessons } : mod));
        try {
            const payload = newLessons.map((l, index) => ({ uid: l.uid, sort_order: index + 1 }));
            await OrgCourseContentService.reorderLessons(workspaceUid, courseUid, moduleUid, payload);
        } catch (error) {
            toast.error("Error al guardar el orden de las lecciones.");
            loadContent();
        }
    };

    // Actualizar lección existente
    const updateLesson = async (moduleUid: string, lessonUid: string, data: CreateLessonDto) => {
        setIsCreating(true);
        try {
            await OrgCourseContentService.updateLesson(workspaceUid, courseUid, moduleUid, lessonUid, data);
            toast.success("Lección actualizada correctamente.");
            await loadContent();
            return true;
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error al actualizar la lección.");
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    // Eliminar lección
    const deleteLesson = async (moduleUid: string, lessonUid: string) => {
        try {
            await OrgCourseContentService.deleteLesson(workspaceUid, courseUid, moduleUid, lessonUid);
            toast.success("Lección eliminada correctamente.");
            await loadContent();
            return true;
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error al eliminar la lección.");
            return false;
        }
    };

    return {
        modules,
        isLoading,
        isCreating,
        loadContent,
        createModule,
        updateModule,
        deleteModule,
        createLesson,
        reorderModules,
        reorderLessons, updateLesson, deleteLesson,

    };
}