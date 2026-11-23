"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrgProjectTask } from "@/services/projects/org-task.service";
import {
  PHASE_COLORS,
  PHASE_LABELS,
  TaskDueBadge,
  TaskStatusBadge,
  AssigneeAvatars,
  formatDateRange,
  compareByDeadline,
  getPhaseKey,
} from "./tasks-columns"; // Ajusta la ruta si tu archivo de columnas tiene otro nombre o carpeta

interface MilestonesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: OrgProjectTask[];
  members?: any[];
  onSelect: (task: OrgProjectTask) => void;
}

export function MilestonesSheet({
  open,
  onOpenChange,
  tasks,
  members = [],
  onSelect,
}: MilestonesSheetProps) {
  const milestones = tasks.filter((t) => t.is_milestone).sort(compareByDeadline);
  const done = milestones.filter((t) => t.status === "completed").length;
  const pct = milestones.length > 0 ? Math.round((done / milestones.length) * 100) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="space-y-3 border-b border-border px-6 py-4 text-left">
          <div>
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <span className="text-amber-500">◆</span> Hitos del proyecto
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Las entregas más importantes, ordenadas por fecha.
            </SheetDescription>
          </div>

          {milestones.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{done}</span> de{" "}
                  <span className="font-semibold text-foreground">{milestones.length}</span> completados
                </span>
                <span className="font-semibold text-muted-foreground">{pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {milestones.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-medium text-foreground">Aún no hay hitos</p>
              <p className="mt-1 px-6 text-xs text-muted-foreground">
                Marca una tarea como “hito importante” al crearla o editarla.
              </p>
            </div>
          ) : (
            milestones.map((task, index) => {
              const completed = task.status === "completed";
              const phaseColor = PHASE_COLORS[getPhaseKey(task)] ?? PHASE_COLORS.general;
              return (
                <button
                  key={task.uid}
                  type="button"
                  onClick={() => onSelect(task)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="flex w-full animate-in fade-in-0 slide-in-from-right-2 flex-col gap-2.5 rounded-xl border border-border bg-card p-3 text-left duration-300 fill-mode-backwards transition-all hover:border-amber-400 hover:shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className={completed ? "text-emerald-500" : "text-amber-500"}>◆</span>
                    <span
                      className={`text-sm font-medium ${
                        completed ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {task.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground ${phaseColor.header} ${phaseColor.border}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${phaseColor.dot}`} />
                      {task.phase && PHASE_LABELS[task.phase] ? PHASE_LABELS[task.phase] : "General · Sin fase"}
                    </span>
                    <TaskStatusBadge status={task.status} />
                    <TaskDueBadge task={task} />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDateRange(task)}
                    </span>
                    <AssigneeAvatars task={task} members={members} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}