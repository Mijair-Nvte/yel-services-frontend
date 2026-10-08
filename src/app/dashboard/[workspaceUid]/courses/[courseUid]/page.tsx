"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Layers, Settings, BarChart3, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgCourse, OrgCourseService } from "@/services/org-course/org-course.service";
import { CourseForm } from "@/components/org_courses/course-form";
import { CourseHeader } from "@/components/org_courses/course-header";
import { CourseModulesManager } from "@/components/org_courses/course-modules-manager";
export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceUid = params.workspaceUid as string;
  const courseUid = params.courseUid as string;

  const [course, setCourse] = useState<OrgCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <TabsContent value="analytics" className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Panel de Alumnos y Progreso</h3>
            <p className="text-sm text-slate-500">Pronto podrás visualizar aquí las métricas de inscripción y avance de tus estudiantes.</p>
          </div>
        </TabsContent>

     
      </Tabs>
    </div>
  );
}  