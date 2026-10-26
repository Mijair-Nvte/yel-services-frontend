"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { OrgCourseService, CourseStudent, PaginatedMeta } from "@/services/org-course/org-course.service";
import { PaginationState } from "@tanstack/react-table";

export function useCourseStudents(workspaceUid: string, courseUid: string) {
    const [students, setStudents] = useState<CourseStudent[]>([]);
    const [meta, setMeta] = useState<PaginatedMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [globalSearch, setGlobalSearch] = useState("");
    
    // Estado de paginación para TanStack Table (pageIndex es base 0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const loadStudents = useCallback(async () => {
        if (!workspaceUid || !courseUid) return;
        
        setIsLoading(true);
        try {
            // Sumamos 1 a pageIndex porque Laravel usa páginas base 1 (1, 2, 3...) 
            // pero TanStack Table usa base 0 (0, 1, 2...)
            const res = await OrgCourseService.getStudents(
                workspaceUid,
                courseUid,
                pagination.pageIndex + 1,
                pagination.pageSize,
                globalSearch
            );
            
            setStudents(res.data || []);
            setMeta(res.meta || null);
        } catch (error) {
            toast.error("Error al cargar los alumnos del curso.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid, courseUid, pagination.pageIndex, pagination.pageSize, globalSearch]);

    // Recargar datos cuando cambie la paginación o la búsqueda
    useEffect(() => {
        // Podrías agregar un debounce (setTimeout) aquí si notas que busca muchas veces al escribir rápido
        const delayDebounceFn = setTimeout(() => {
            loadStudents();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [loadStudents]);

    return {
        students,
        meta,
        isLoading,
        globalSearch,
        setGlobalSearch,
        pagination,
        setPagination,
        loadStudents,
    };
}