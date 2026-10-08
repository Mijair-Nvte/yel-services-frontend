"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, BookOpen, Plus, PlaySquare, FileVideo } from "lucide-react";
import { useAdminCourses } from "@/hooks/org_courses/use-courses";
import { CourseTable } from "@/components/org_courses/course-admin-table";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";
import { Button } from "@/components/ui/button";

export default function PageCourses() {
    const router = useRouter();
    const { workspaceUid } = useParams() as { workspaceUid: string };
    const { courses, meta, isLoading, loadData, deleteCourse } = useAdminCourses(workspaceUid);

    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 100,
    });

    useEffect(() => {
        if (!isLoading && courses) {
            setHasLoadedOnce(true);
        }
    }, [isLoading, courses]);

    useEffect(() => {
        setIsSearching(true);
        const delayDebounce = setTimeout(async () => {
            await loadData(pagination.pageIndex + 1, pagination.pageSize, search);
            setIsSearching(false);
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [pagination.pageIndex, pagination.pageSize, search, loadData]);

    // KPIs adaptados para Cursos
    const kpiItems: KpiItem[] = useMemo(() => {
        const totalCourses = meta?.total || 0;
        const published = meta?.kpis?.total_published || 0;
        const drafts = meta?.kpis?.total_drafts || 0;

        return [
            {
                label: "Total de Cursos",
                value: totalCourses,
                icon: BookOpen,
                color: "text-indigo-600",
                iconBg: "bg-indigo-100",
                cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
                hoverShadow: "hover:shadow-indigo-500/20",
                borderColor: "hover:border-indigo-400",
                subtitle: "En tu catálogo"
            },
            {
                label: "Publicados",
                value: published,
                icon: PlaySquare,
                color: "text-emerald-600",
                iconBg: "bg-emerald-100",
                cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
                hoverShadow: "hover:shadow-emerald-500/20",
                borderColor: "hover:border-emerald-400",
                subtitle: "Visibles para usuarios"
            },
            {
                label: "Borradores",
                value: drafts,
                icon: FileVideo,
                color: "text-amber-600",
                iconBg: "bg-amber-100",
                cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
                hoverShadow: "hover:shadow-amber-500/20",
                borderColor: "hover:border-amber-400",
                subtitle: "En edición o pendientes"
            }
        ];
    }, [meta]);

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        Gestión de Cursos
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Crea y administra tus cursos, módulos y lecciones en video.
                    </p>
                </div>
                <div>
                    <Button onClick={() => {
                        // En el siguiente paso crearemos la página/modal para crear cursos
                        router.push(`/dashboard/${workspaceUid}/courses/new`);
                    }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Curso
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            {!isLoading && <KpiCards items={kpiItems} columns="sm:grid-cols-3" />}

            {/* Content Grid */}
            {!hasLoadedOnce && isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-slate-400 text-sm font-medium">Cargando catálogo...</p>
                </div>
            ) : (
                <div className="relative">
                    {isSearching && (
                        <div className="absolute top-3 right-4 z-30 flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-full shadow-md border border-slate-200 text-xs font-medium text-indigo-600">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Actualizando...
                        </div>
                    )}

                    <CourseTable
                        courses={courses}
                        meta={meta}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        search={search}
                        onSearchChange={(value) => {
                            setSearch(value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        onView={(course) => router.push(`/dashboard/${workspaceUid}/courses/${course.uid}`)}
                        onDelete={async (uid: string) => {
                            if (confirm("¿Eliminar este curso? Sus módulos y lecciones también se borrarán.")) {
                                await deleteCourse(uid);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}