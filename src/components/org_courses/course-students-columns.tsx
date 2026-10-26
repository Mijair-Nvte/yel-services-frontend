"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CourseStudent } from "@/services/org-course/org-course.service";

export const getCourseStudentColumns = (): ColumnDef<CourseStudent>[] => [
    {
        id: "student",
        header: "Alumno",
        accessorFn: (row) => `${row.user?.name} ${row.user?.email}`,
        cell: ({ row }) => {
            const student = row.original.user;
            return (
                <div>
                    <div className="font-semibold text-slate-900">{student?.name || "Desconocido"}</div>
                    <div className="text-xs text-slate-500">{student?.email || "Sin correo"}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "enrolled_at",
        header: "Fecha de Inscripción",
        cell: ({ row }) => {
            const date = row.original.enrolled_at;
            if (!date) return <span className="text-sm text-slate-300">-</span>;
            return (
                <span className="text-sm font-medium text-slate-600">
                    {new Date(date).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
            );
        },
    },
    {
        accessorKey: "source",
        header: "Origen (Source)",
        cell: ({ row }) => {
            const source = row.original.source || "Directo";
            return <span className="text-sm text-slate-600 capitalize">{source}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Estatus",
        cell: ({ row }) => {
            const status = row.original.status;
            const config: Record<string, { bg: string; label: string }> = {
                active: { bg: "bg-emerald-100 text-emerald-800", label: "Activo" },
                suspended: { bg: "bg-amber-100 text-amber-800", label: "Suspendido" },
                cancelled: { bg: "bg-rose-100 text-rose-800", label: "Cancelado" },
            };

            const current = config[status] || { bg: "bg-slate-100 text-slate-800", label: status };

            return <Badge className={`${current.bg} border-none shadow-none`}>{current.label}</Badge>;
        },
    },
];