"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Layers, Settings, BarChart3, BookOpen, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useCourseStudents } from "@/hooks/org_courses/use-course-students";
import { CourseStudentsTable } from "@/components/org_courses/course-students-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgCourse, OrgCourseService } from "@/services/org-course/org-course.service";
import { CourseForm } from "@/components/org_courses/course-form";
import { CourseHeader } from "@/components/org_courses/course-header";
import { CourseModulesManager } from "@/components/org_courses/course-modules-manager";
import { Button } from "@/components/ui/button";
export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceUid = params.workspaceUid as string;
  const courseUid = params.courseUid as string;

  const [course, setCourse] = useState<OrgCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    students,
    meta,
    pagination,
    setPagination,
    globalSearch,
    setGlobalSearch,
    isLoading: isLoadingStudents
  } = useCourseStudents(workspaceUid, courseUid);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const data = await OrgCourseService.getOne(workspaceUid, courseUid);
      setCourse(data);
    } catch (error: any) {
      toast.error("No se pudo cargar la información del curso.");
      router.push(`/dashboard/${workspaceUid}/courses`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceUid && courseUid) {
      fetchCourse();
    }
  }, [workspaceUid, courseUid]);

  const handleDeleteCourse = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.")) return;

    try {
      await OrgCourseService.delete(workspaceUid, courseUid);
      toast.success("Curso eliminado correctamente.");
      router.push(`/dashboard/${workspaceUid}/courses`);
    } catch (error) {
      toast.error("Error al eliminar el curso.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6 p-1  ">
      {/* Header Modular */}
      <CourseHeader
        course={course}
        workspaceUid={workspaceUid}
        onDelete={handleDeleteCourse}
      />

      {/* Tabs SaaS Profesionales */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 shadow-sm rounded-xl">
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg px-4 py-2 font-medium"
          >
            <Settings className="h-4 w-4" /> Información General
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg px-4 py-2 font-medium"
          >
            <Layers className="h-4 w-4" /> Módulos y Lecciones
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg px-4 py-2 font-medium"
          >
            <BarChart3 className="h-4 w-4" /> Alumnos y Estadísticas
          </TabsTrigger>

        </TabsList>

        {/* Pestaña 3: Configuración / Información General */}
        <TabsContent value="settings" className="space-y-4">
          <CourseForm workspaceUid={workspaceUid} initialData={course} />
        </TabsContent>

        {/* Pestaña 1: Módulos y Lecciones */}
        <TabsContent value="content" className="space-y-4">
          <CourseModulesManager workspaceUid={workspaceUid} courseUid={courseUid} />
        </TabsContent>

        {/* Pestaña 2: Alumnos y Estadísticas (Preparada para el futuro) */}
        {/* Pestaña 2: Alumnos y Estadísticas */}
        <TabsContent value="analytics" className="space-y-4">

          {/* Header de la pestaña */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Alumnos Inscritos</h3>
              <p className="text-sm text-slate-500">
                Total de estudiantes activos: {meta?.kpis?.total_active || 0}
              </p>
            </div>
            <Button
              onClick={() => router.push(`/dashboard/${workspaceUid}/courses/${courseUid}/import`)}
              className="bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm gap-2 font-medium"
            >
              <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
              Importar Alumnos (CSV)
            </Button>
          </div>

          {/* 👇 LA NUEVA TABLA MODULAR */}
          <CourseStudentsTable
            students={students}
            pageCount={meta?.last_page || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            globalSearch={globalSearch}
            onSearchChange={setGlobalSearch}
          />

        </TabsContent>


      </Tabs>
    </div>
  );
}  