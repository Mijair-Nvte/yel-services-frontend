"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/org_courses/course-form";

export default function NewCoursePage() {
  const router = useRouter();
  const { workspaceUid } = useParams() as { workspaceUid: string };

  return (
    <div className="space-y-6 p-1 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9 bg-white shadow-sm" 
          onClick={() => router.push(`/dashboard/${workspaceUid}/courses`)}
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            Crear Nuevo Curso
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configura los detalles principales de la entidad. Las lecciones se agregarán posteriormente.
          </p>
        </div>
      </div>

      {/* Formulario Modular */}
      <div className="mt-8">
        <CourseForm workspaceUid={workspaceUid} />
      </div>
    </div>
  );
}