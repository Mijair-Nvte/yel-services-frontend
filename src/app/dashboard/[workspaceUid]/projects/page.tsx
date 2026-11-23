"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Briefcase, Activity, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";
import { useAdminProjects } from "@/hooks/projects/use-admin-projects";
import { ProjectsAdminTable } from "@/components/projects/projects-admin-table";
import { OrgProject } from "@/services/projects/org-project.service";
import { ProjectDialog } from "@/components/projects/project-dialog";

export default function ProjectsAdminPage() {
    const { workspaceUid } = useParams() as { workspaceUid: string };
    const router = useRouter();
    const { projects, isLoading, loadData, createProject, updateProject, deleteProject } = useAdminProjects(workspaceUid);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<OrgProject | null>(null);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const kpiItems: KpiItem[] = useMemo(() => {
        const total = projects.length;
        const active = projects.filter(p => p.status === 'active').length;
        const completed = projects.filter(p => p.status === 'completed').length;

        return [
            {
                label: "Total Proyectos",
                value: total,
                icon: Briefcase,
                color: "text-indigo-600",
                iconBg: "bg-indigo-100",
                cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
                hoverShadow: "hover:shadow-indigo-500/20",
                borderColor: "hover:border-indigo-400",
                subtitle: "Histórico completo",
            },
            {
                label: "Proyectos Activos",
                value: active,
                icon: Activity,
                color: "text-emerald-600",
                iconBg: "bg-emerald-100",
                cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
                hoverShadow: "hover:shadow-emerald-500/20",
                borderColor: "hover:border-emerald-400",
                subtitle: "En progreso actual",
            },
            {
                label: "Completados",
                value: completed,
                icon: CheckCircle,
                color: "text-blue-600",
                iconBg: "bg-blue-100",
                cardBg: "bg-blue-50/50 dark:bg-blue-950/20",
                hoverShadow: "hover:shadow-blue-500/20",
                borderColor: "hover:border-blue-400",
                subtitle: "Metas alcanzadas",
            }
        ];
    }, [projects]);

    const handleSubmitProject = async (data: any) => {
        if (selectedProject) {
            await updateProject(selectedProject.uid, data);
        } else {
            await createProject(data);
        }
    };

    const handleDeleteProject = async () => {
        if (selectedProject) {
            await deleteProject(selectedProject.uid);
            setIsDialogOpen(false);
        }
    };

    const handleEdit = (project: OrgProject) => {
        setSelectedProject(project);
        setIsDialogOpen(true);
    };

    const handleView = (project: OrgProject) => {
        // Al hacer clic, nos iremos a la vista de tareas del proyecto
        router.push(`/dashboard/${workspaceUid}/projects/${project.uid}`);
    };

    return (
        <div className="space-y-6 p-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        Gestión de Proyectos
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Administra los proyectos de tu equipo, áreas involucradas y el progreso general.
                    </p>
                </div>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => {
                        setSelectedProject(null);
                        setIsDialogOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
                </Button>
            </div>

            {!isLoading && (
                <KpiCards items={kpiItems} columns="sm:grid-cols-2 lg:grid-cols-3" />
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-slate-400 text-sm font-medium">Cargando proyectos...</p>
                </div>
            ) : (
                <ProjectsAdminTable
                    projects={projects}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={async (uid) => {
                        if (confirm("¿Estás seguro de eliminar este proyecto? Se borrarán todas sus tareas.")) {
                            await deleteProject(uid);
                        }
                    }}
                />
            )}

            <ProjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmitProject}
                onDelete={selectedProject ? handleDeleteProject : undefined}
                projectToEdit={selectedProject}
            />
        </div>
    );
}