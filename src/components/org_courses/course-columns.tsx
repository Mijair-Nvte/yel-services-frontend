"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OrgCourse } from "@/services/org-course/org-course.service";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { PlayCircle, Globe, Lock } from "lucide-react";

interface CourseColumnProps {
    onView: (course: OrgCourse) => void;
    onDelete: (uid: string) => void;
}

export const getCourseColumns = ({ onView, onDelete }: CourseColumnProps): ColumnDef<OrgCourse>[] => [
    {
        id: "title",
        header: "Curso",
        cell: ({ row }) => {
            const course = row.original;
            return (
                <div 
                    className="cursor-pointer group flex items-center gap-3" 
                    onClick={() => onView(course)}
                >
                    <div className="h-10 w-10 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        {course.cover_url ? (
                            <img src={course.cover_url} alt={course.title} className="h-full w-full object-cover rounded-md" />
                        ) : (
                            <PlayCircle className="h-5 w-5 text-indigo-400" />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {course.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1">
                            {course.description || "Sin descripción"}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusMap = {
                published: { label: "Publicado", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                draft: { label: "Borrador", class: "bg-amber-50 text-amber-700 border-amber-200" },
                archived: { label: "Archivado", class: "bg-slate-50 text-slate-700 border-slate-200" },
            };
            const config = statusMap[status] || statusMap.draft;

            return (
                <Badge variant="outline" className={`${config.class} font-medium`}>
                    {config.label}
                </Badge>
            );
        },
    },
    {
        id: "access",
        header: "Acceso",
        cell: ({ row }) => {
            const isFree = row.original.is_free;
            return (
                <div className="flex items-center gap-1.5 text-sm">
                    {isFree ? (
                        <><Globe className="h-4 w-4 text-emerald-500" /> <span className="text-slate-600">Gratuito</span></>
                    ) : (
                        <><Lock className="h-4 w-4 text-indigo-500" /> <span className="text-slate-600">De Pago</span></>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Acciones</div>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-end pr-2">
                    <DataTableRowActions
                        row={row}
                        onView={() => onView(row.original)}
                        onDelete={() => onDelete(row.original.uid)}
                    />
                </div>
            );
        },
    },
];