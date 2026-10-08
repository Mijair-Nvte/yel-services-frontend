"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { OrgCourseService, OrgCourse, CreateCourseDto, UpdateCourseDto } from "@/services/org-course/org-course.service";

export function useAdminCourses(workspaceUid: string) {
    const [courses, setCourses] = useState<OrgCourse[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async (page: number = 1, perPage: number = 100, search: string = "") => {
        if (!workspaceUid) return;
        setIsLoading(true);
        try {
            const res = await OrgCourseService.getAll(workspaceUid, page, perPage, search);
            setCourses(res.data || []);
            setMeta(res.meta || null);
        } catch (error) {
            toast.error("Error al cargar los cursos.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid]);

    const createCourse = async (data: CreateCourseDto) => {
        try {
            await OrgCourseService.create(workspaceUid, data);
            toast.success("Curso creado correctamente.");
            await loadData();
        } catch (error: unknown) {
            toast.error("Ocurrió un error al crear el curso.");
            throw error;
        }
    };

    const updateCourse = async (courseUid: string, data: UpdateCourseDto) => {
        try {
            await OrgCourseService.update(workspaceUid, courseUid, data);
            toast.success("Curso actualizado correctamente.");
            await loadData();
        } catch (error: unknown) {
            toast.error("Ocurrió un error al actualizar el curso.");
            throw error;
        }
    };

    const deleteCourse = async (courseUid: string) => {
        try {
            await OrgCourseService.delete(workspaceUid, courseUid);
            toast.success("Curso eliminado correctamente.");
            await loadData();
        } catch (error: unknown) {
            toast.error("Error al eliminar el curso.");
            throw error;
        }
    };

    return {
        courses,
        meta,
        isLoading,
        loadData,
        createCourse,
        updateCourse,
        deleteCourse,
    };
}