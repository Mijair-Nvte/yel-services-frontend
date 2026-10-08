"use client";

import React, { useMemo } from "react";
import { OrgCourse } from "@/services/org-course/org-course.service";
import { DataTable } from "@/components/ui/data-table";
import { getCourseColumns } from "./course-columns";
import { PaginationState, OnChangeFn } from "@tanstack/react-table"; 

interface CourseTableProps {
    courses: OrgCourse[];
    onView: (course: OrgCourse) => void;
    onDelete: (uid: string) => void;
    search: string;
    onSearchChange: (value: string) => void;
    meta?: any;
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
}

export function CourseTable({ 
    courses,
    meta,
    pagination,
    onPaginationChange, 
    onView, 
    onDelete,
    search,
    onSearchChange
}: CourseTableProps) {
    
    const columns = useMemo(
        () => getCourseColumns({ onView, onDelete }),
        [onView, onDelete]
    );

    return (
        <DataTable 
            columns={columns} 
            data={courses} 
            manualPagination={true}
            manualFiltering={true}
            pageCount={meta?.last_page ?? -1} 
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            globalFilter={search}
            onGlobalFilterChange={onSearchChange}
        />
    );
}