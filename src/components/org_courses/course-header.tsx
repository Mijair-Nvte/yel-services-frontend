"use client";

import { OrgCourse } from "@/services/org-course/org-course.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Lock, PlayCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseHeaderProps {
  course: OrgCourse;
  workspaceUid: string;
  onDelete: () => void;
}

export function CourseHeader({ course, workspaceUid, onDelete }: CourseHeaderProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Publicado</Badge>;
      case "archived":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100">Archivado</Badge>;
      default:
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Borrador</Badge>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div className="flex items-start gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 bg-white shadow-sm shrink-0 mt-1"
          onClick={() => router.push(`/dashboard/${workspaceUid}/courses`)}
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </Button>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{course.title}</h1>
            {getStatusBadge(course.status)}
            <Badge variant="outline" className="text-slate-600 bg-slate-50">
              {course.is_free ? (
                <span className="text-emerald-600 font-medium">Gratuito</span>
              ) : (
                <span className="text-indigo-600 font-medium">${course.price} USD</span>
              )}
            </Badge>
          </div>
          <p className="text-slate-500 text-sm line-clamp-1">
            {course.description || "Sin descripción proporcionada."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        <Button 
          variant="outline" 
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Eliminar Curso
        </Button>
      </div>
    </div>
  );
}