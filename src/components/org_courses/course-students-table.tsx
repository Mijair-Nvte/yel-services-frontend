"use client";

import React, { useMemo } from "react";
import { CourseStudent } from "@/services/org-course/org-course.service";
import { DataTable } from "@/components/ui/data-table";
import { getCourseStudentColumns } from "./course-students-columns";
import { PaginationState, OnChangeFn } from "@tanstack/react-table";

interface CourseStudentsTableProps {
    students: CourseStudent[];
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    globalSearch: string;
    onSearchChange: (value: string) => void;
}

export function CourseStudentsTable({
    students,
    pageCount,
    pagination,
    onPaginationChange,
    globalSearch,
    onSearchChange
}: CourseStudentsTableProps) {

    const columns = useMemo(() => getCourseStudentColumns(), []);

    return (
        <DataTable
            columns={columns}
            data={students}
            // Paginación Manual (desde el servidor)
            manualPagination={true}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            // Búsqueda Manual (desde el servidor)
            manualFiltering={true}
            globalFilter={globalSearch}
            onGlobalFilterChange={onSearchChange}
            // Filtros rápidos locales para el estatus
            filterColumn="status"
            filterOptions={[
                { label: "Activos", value: "active" },
                { label: "Suspendidos", value: "suspended" },
                { label: "Cancelados", value: "cancelled" },
            ]}
        />
    );
}