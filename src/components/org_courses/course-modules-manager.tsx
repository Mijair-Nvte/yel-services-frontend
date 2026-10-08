"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, GripVertical, Video, ChevronDown, ChevronUp, BookOpen, PlayCircle, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCourseContent } from "@/hooks/org_courses/use-course-content";
import { OrgCourseContentService, OrgCourseModule, OrgCourseLesson } from "@/services/org-course/org-course.service";
import { ModuleModal } from "./ModuleModal";
import { LessonModal } from "./LessonModal";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

// Imports de DND-Kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CourseModulesManagerProps {
  workspaceUid: string;
  courseUid: string;
}

// 🧱 Sub-componente para cada Lección individual (Sortable con DND-Kit)
function SortableLessonItem({
  lesson,
  index,
  moduleIndex,
  moduleUid,
  onEditLesson,
  onDeleteLesson,
}: {
  lesson: OrgCourseLesson;
  index: number;
  moduleIndex: number;
  moduleUid: string;
  onEditLesson: (moduleUid: string, lesson: OrgCourseLesson) => void;
  onDeleteLesson: (moduleUid: string, lessonUid: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.uid });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-indigo-100 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Asa de arrastre exclusiva para la lección */}
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 focus:outline-none">
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
          {lesson.video_path ? <PlayCircle className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </div>

        <div>
          <h5 className="text-sm font-medium text-slate-900">
            {moduleIndex + 1}.{index + 1} {lesson.title}
          </h5>
          {lesson.is_free_preview && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm mt-1 inline-block uppercase tracking-wider">
              Vista Previa Gratis
            </span>
          )}
        </div>
      </div>

      {/* Acciones de la Lección */}
      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-indigo-600"
          onClick={() => onEditLesson(moduleUid, lesson)}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>

        <ConfirmDeleteDialog
          title="¿Eliminar lección?"
          description={`¿Estás seguro de eliminar la lección "${lesson.title}"? Su video asociado también será eliminado.`}
          confirmText="Sí, eliminar"
          onConfirm={() => onDeleteLesson(moduleUid, lesson.uid)}
        />
      </div>
    </div>
  );
}

// 🧱 Sub-componente interno para cada Módulo "Sortable"
function SortableModuleItem({
  module,
  index,
  isExpanded,
  toggleModule,
  onEditModule,
  onDeleteModule,
  onOpenCreateLesson,
  onEditLesson,
  onDeleteLesson,
}: {
  module: OrgCourseModule;
  index: number;
  isExpanded: boolean;
  toggleModule: (uid: string) => void;
  onEditModule: (mod: OrgCourseModule) => void;
  onDeleteModule: (uid: string) => void;
  onOpenCreateLesson: (moduleUid: string) => void;
  onEditLesson: (moduleUid: string, lesson: OrgCourseLesson) => void;
  onDeleteLesson: (moduleUid: string, lessonUid: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.uid });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all">
      {/* Header del Módulo */}
      <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          {/* Asa de arrastre del módulo */}
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 focus:outline-none">
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="flex-1 cursor-pointer" onClick={() => toggleModule(module.uid)}>
            <h4 className="font-semibold text-slate-900">
              <span className="text-indigo-600 mr-2">Módulo {index + 1}:</span> {module.title}
            </h4>
            {module.description && <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{module.description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
            {module.lessons?.length || 0} lecciones
          </span>

          <div className="flex items-center gap-1 border-l pl-3 border-slate-200">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => onEditModule(module)}>
              <Edit2 className="h-4 w-4" />
            </Button>

            <ConfirmDeleteDialog
              title="¿Eliminar módulo?"
              description={`Se eliminará el módulo "${module.title}" junto con todas sus lecciones.`}
              confirmText="Sí, eliminar"
              onConfirm={() => onDeleteModule(module.uid)}
            />
          </div>

          <div className="cursor-pointer" onClick={() => toggleModule(module.uid)}>
            {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
          </div>
        </div>
      </div>

      {/* Contenido del Módulo (Lecciones Arrastrables) */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-100 space-y-3">
          {module.lessons && module.lessons.length > 0 ? (
            <SortableContext
              items={module.lessons.map(l => l.uid)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {module.lessons.map((lesson, lIdx) => (
                  <SortableLessonItem
                    key={lesson.uid}
                    lesson={lesson}
                    index={lIdx}
                    moduleIndex={index}
                    moduleUid={module.uid}
                    onEditLesson={onEditLesson}
                    onDeleteLesson={onDeleteLesson}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            <div className="text-center py-6 text-sm text-slate-500">Este módulo aún no tiene lecciones.</div>
          )}

          <div className="pt-2 pl-10">
            <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => onOpenCreateLesson(module.uid)}>
              <Plus className="h-3 w-3 mr-1" /> Agregar Lección
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 📦 Componente Principal
export function CourseModulesManager({ workspaceUid, courseUid }: CourseModulesManagerProps) {
  const {
    modules,
    isLoading,
    isCreating,
    loadContent,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderModules,
    reorderLessons
  } = useCourseContent(workspaceUid, courseUid);

  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<OrgCourseModule | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleUid, setActiveModuleUid] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<OrgCourseLesson | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const toggleModule = (uid: string) => {
    setExpandedModules((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleModuleSubmit = async (data: { title: string; description: string }) => {
    let success = false;
    if (editingModule) {
      success = await updateModule(editingModule.uid, data);
    } else {
      success = await createModule(data);
    }
    if (success) {
      setIsModuleModalOpen(false);
      setEditingModule(null);
    }
  };

  const handleLessonSubmit = async (
    formData: { title: string; description: string; is_free_preview: boolean },
    lessonFile: File | null
  ) => {
    if (!activeModuleUid) return;
    if (!formData.title) return toast.error("El título de la lección es obligatorio.");

    try {
      let finalVideoPath = editingLesson?.video_path || "";

      if (lessonFile instanceof File) {
        setUploadingStatus("Generando enlace seguro...");
        const presign = await OrgCourseContentService.presignLessonVideo(workspaceUid, courseUid, lessonFile.name, lessonFile.type);

        setUploadingStatus("Subiendo video...");
        const uploadResponse = await fetch(presign.upload_url, {
          method: "PUT",
          headers: { "Content-Type": lessonFile.type },
          body: lessonFile,
        });

        if (!uploadResponse.ok) throw new Error("Error al subir el archivo de video.");

        // Guardamos el path limpio devuelto por la presignación
        finalVideoPath = presign.path;
      }

      setUploadingStatus(editingLesson ? "Actualizando lección..." : "Guardando lección...");

      let success = false;
      if (editingLesson) {
        success = await updateLesson(activeModuleUid, editingLesson.uid, {
          title: formData.title,
          description: formData.description,
          video_path: finalVideoPath,
          is_free_preview: formData.is_free_preview,
          duration_seconds: editingLesson.duration_seconds || 0,
        });
      } else {
        success = await createLesson(activeModuleUid, {
          title: formData.title,
          description: formData.description,
          video_path: finalVideoPath,
          is_free_preview: formData.is_free_preview,
          duration_seconds: 0,
        });
      }

      if (success) {
        setIsLessonModalOpen(false);
        setEditingLesson(null);
        if (!expandedModules.includes(activeModuleUid)) {
          setExpandedModules(prev => [...prev, activeModuleUid]);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al procesar la lección.");
    } finally {
      setUploadingStatus("");
    }
  };

  // Manejador inteligente de arrastre tanto para Módulos como para Lecciones
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Caso 1: Es un Módulo el que se está moviendo
    const oldModuleIndex = modules.findIndex((m) => m.uid === activeId);
    const newModuleIndex = modules.findIndex((m) => m.uid === overId);

    if (oldModuleIndex !== -1 && newModuleIndex !== -1) {
      const newModules = arrayMove(modules, oldModuleIndex, newModuleIndex);
      reorderModules(newModules);
      return;
    }

    // Caso 2: Es una Lección la que se está moviendo dentro de su respectivo módulo
    for (const module of modules) {
      if (!module.lessons) continue;

      const oldLessonIndex = module.lessons.findIndex((l) => l.uid === activeId);
      const newLessonIndex = module.lessons.findIndex((l) => l.uid === overId);

      if (oldLessonIndex !== -1 && newLessonIndex !== -1) {
        const updatedLessons = arrayMove(module.lessons, oldLessonIndex, newLessonIndex);
        reorderLessons(module.uid, updatedLessons);
        break;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Temario del Curso</h3>
        {modules.length > 0 && (
          <Button onClick={() => { setEditingModule(null); setIsModuleModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Módulo
          </Button>
        )}
      </div>

      {modules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 ring-8 ring-indigo-50/50">
            <BookOpen className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900">Estructura del Curso</h3>
            <p className="text-sm text-slate-500">Organiza tu contenido creando módulos temáticos.</p>
          </div>
          <div className="pt-2">
            <Button onClick={() => { setEditingModule(null); setIsModuleModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" /> Crear Primer Módulo
            </Button>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={modules.map(m => m.uid)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {modules.map((module, index) => (
                <SortableModuleItem
                  key={module.uid}
                  module={module}
                  index={index}
                  isExpanded={expandedModules.includes(module.uid)}
                  toggleModule={toggleModule}
                  onEditModule={(mod) => { setEditingModule(mod); setIsModuleModalOpen(true); }}
                  onDeleteModule={(uid) => deleteModule(uid)}
                  onOpenCreateLesson={(uid) => {
                    setActiveModuleUid(uid);
                    setEditingLesson(null);
                    setIsLessonModalOpen(true);
                  }}
                  onEditLesson={(uid, lesson) => {
                    setActiveModuleUid(uid);
                    setEditingLesson(lesson);
                    setIsLessonModalOpen(true);
                  }}
                  onDeleteLesson={(uid, lessonUid) => deleteLesson(uid, lessonUid)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal Módulo */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => { setIsModuleModalOpen(false); setEditingModule(null); }}
        onSubmit={handleModuleSubmit}
        isSubmitting={isCreating}
        initialData={editingModule ? { title: editingModule.title, description: editingModule.description || "" } : null}
      />

      {/* Modal Lección */}
      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => { setIsLessonModalOpen(false); setEditingLesson(null); }}
        onSubmit={handleLessonSubmit}
        isSubmitting={isCreating}
        uploadingStatus={uploadingStatus}
        initialData={editingLesson}
      />
    </div>
  );
}