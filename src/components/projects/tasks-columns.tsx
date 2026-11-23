"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrgProjectTask } from "@/services/projects/org-task.service";
import { Check, ChevronDown, DollarSign, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskColumnProps {
  onEdit: (task: OrgProjectTask) => void;
  onDelete: (uid: string) => void;
  members?: any[]; // Lista del equipo para mapear avatares
}

export const PHASE_LABELS: Record<string, string> = {
  fase_0: "Fase 0 · Arranque",
  fase_1: "Fase 1 · Fundamentos",
  fase_2: "Fase 2 · Lanzamiento visual",
  fase_3: "Fase 3 · Comunicación y sistemas",
  fase_4: "Fase 4 · Consolidación y medición",
};

// Colores casi blancos, uno por fase (clases literales para que Tailwind las detecte)
export const PHASE_COLORS: Record<
  string,
  { header: string; hover: string; border: string; dot: string; bar: string; text: string }
> = {
  general: {
    header: " dark:bg-slate-500/10",
    hover: "hover:bg-slate-100/70 dark:hover:bg-slate-500/15",
    border: "border-slate-200/70 dark:border-slate-500/20",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
    text: "text-slate-500",
  },
  fase_0: {
    header: " dark:bg-pink-500/10",
    hover: "hover:bg-pink-100/70 dark:hover:bg-pink-500/15",
    border: "border-pink-200/70 dark:border-pink-500/20",
    dot: "bg-pink-400",
    bar: "bg-pink-400",
    text: "text-pink-500",
  },
  fase_1: {
    header: "dark:bg-sky-500/10",
    hover: "hover:bg-sky-100/70 dark:hover:bg-sky-500/15",
    border: "border-sky-200/70 dark:border-sky-500/20",
    dot: "bg-sky-400",
    bar: "bg-sky-400",
    text: "text-sky-500",
  },
  fase_2: {
    header: " dark:bg-violet-500/10",
    hover: "hover:bg-violet-100/70 dark:hover:bg-violet-500/15",
    border: "border-violet-200/70 dark:border-violet-500/20",
    dot: "bg-violet-400",
    bar: "bg-violet-400",
    text: "text-violet-500",
  },
  fase_3: {
    header: " dark:bg-teal-500/10",
    hover: "hover:bg-teal-100/70 dark:hover:bg-teal-500/15",
    border: "border-teal-200/70 dark:border-teal-500/20",
    dot: "bg-teal-400",
    bar: "bg-teal-400",
    text: "text-teal-500",
  },
  fase_4: {
    header: " dark:bg-orange-500/10",
    hover: "hover:bg-orange-100/70 dark:hover:bg-orange-500/15",
    border: "border-orange-200/70 dark:border-orange-500/20",
    dot: "bg-orange-400",
    bar: "bg-orange-400",
    text: "text-orange-500",
  },
};

export const DEPARTMENT_BADGES: Record<string, { label: string; style: string }> = {
  marketing: { label: "Marketing", style: "bg-primary/10 text-primary" },
  eventos: {
    label: "Eventos",
    style: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  ventas: {
    label: "Ventas",
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  operaciones: { label: "Operaciones", style: "bg-muted text-muted-foreground" },
};

export const STATUS_BADGES: Record<string, { label: string; style: string; dot: string }> = {
  pending: {
    label: "Pendiente",
    style: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
  in_progress: {
    label: "En Proceso",
    style: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  review: {
    label: "En Revisión",
    style: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completada",
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseLocalDate(value: string) {
  const [y, m, d] = value.substring(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Formato compacto: "13 nov ➔ 14 nov" (el año solo si no es el actual)
export function formatDateRange(task: OrgProjectTask) {
  const showYear = task.end_date
    ? parseLocalDate(task.end_date).getFullYear() !== new Date().getFullYear()
    : false;

  const start = task.start_date
    ? parseLocalDate(task.start_date).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })
    : "S/F";
  const end = task.end_date
    ? parseLocalDate(task.end_date).toLocaleDateString(
        "es-MX",
        showYear ? { day: "2-digit", month: "short", year: "numeric" } : { day: "2-digit", month: "short" }
      )
    : "";

  return end ? `${start} ➔ ${end}` : start;
}

// Estado de vencimiento según la fecha fin (las completadas no tienen)
export function getDueInfo(task: OrgProjectTask) {
  if (task.status === "completed") return null;

  if (!task.end_date) {
    return {
      key: "nodate" as const,
      label: "Sin fecha",
      style: "bg-muted text-muted-foreground",
      dot: "bg-muted-foreground/60",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((parseLocalDate(task.end_date).getTime() - today.getTime()) / 86400000);

  if (days < 0) {
    return {
      key: "overdue" as const,
      label: `Vencida ${Math.abs(days)}d`,
      style: "bg-destructive/10 text-destructive",
      dot: "bg-destructive animate-pulse",
    };
  }
  if (days === 0) {
    return {
      key: "today" as const,
      label: "Vence hoy",
      style: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      dot: "bg-amber-500 animate-pulse",
    };
  }
  if (days <= 3) {
    return {
      key: "soon" as const,
      label: days === 1 ? "Vence mañana" : `Vence en ${days}d`,
      style: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      dot: "bg-amber-500",
    };
  }
  return {
    key: "ontime" as const,
    label: "En tiempo",
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
  };
}

export function getPhaseKey(task: OrgProjectTask) {
  return task.phase && PHASE_LABELS[task.phase] ? task.phase : "general";
}

// Abiertas primero, luego por fecha fin (sin fecha al final)
function compareByDeadline(a: OrgProjectTask, b: OrgProjectTask) {
  const aDone = a.status === "completed" ? 1 : 0;
  const bDone = b.status === "completed" ? 1 : 0;
  if (aDone !== bDone) return aDone - bDone;
  const aTime = a.end_date ? parseLocalDate(a.end_date).getTime() : Number.MAX_SAFE_INTEGER;
  const bTime = b.end_date ? parseLocalDate(b.end_date).getTime() : Number.MAX_SAFE_INTEGER;
  return aTime - bTime;
}

// Agrupa por fase: "General" primero, luego Fase 0..4
export function groupTasksByPhase(visible: OrgProjectTask[], all: OrgProjectTask[]) {
  const order = ["general", ...Object.keys(PHASE_LABELS)];

  return order
    .map((key) => {
      const items = visible.filter((t) => getPhaseKey(t) === key).sort(compareByDeadline);
      const inPhase = all.filter((t) => getPhaseKey(t) === key);
      return {
        key,
        label: key === "general" ? "General · Sin fase" : PHASE_LABELS[key],
        items,
        done: inPhase.filter((t) => t.status === "completed").length,
        total: inPhase.length,
        milestones: inPhase.filter((t) => t.is_milestone).length,
        milestonesDone: inPhase.filter((t) => t.is_milestone && t.status === "completed").length,
      };
    })
    .filter((g) => g.items.length > 0);
}

/* ------------------------------------------------------------------ */
/* Componentes reutilizables                                          */
/* ------------------------------------------------------------------ */

export function TaskStatusBadge({ status }: { status: string }) {
  const current = STATUS_BADGES[status] || STATUS_BADGES.pending;
  return (
    <Badge
      className={`${current.style} gap-1.5 whitespace-nowrap border-none text-xs font-medium shadow-none`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </Badge>
  );
}

export function TaskDepartmentBadge({ department }: { department: string }) {
  const current = DEPARTMENT_BADGES[department] || {
    label: department,
    style: "bg-muted text-muted-foreground",
  };
  return (
    <Badge
      className={`${current.style} whitespace-nowrap border-none text-xs font-medium shadow-none`}
    >
      {current.label}
    </Badge>
  );
}

export function TaskDueBadge({ task }: { task: OrgProjectTask }) {
  const due = getDueInfo(task);
  if (!due) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${due.style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${due.dot}`} />
      {due.label}
    </span>
  );
}

export function AssigneeAvatars({
  task,
  members = [],
}: {
  task: OrgProjectTask;
  members?: TaskColumnProps["members"];
}) {
  // IDs asignados (task.assigned_to o task.metadata.assigned_users)
  const assignedIds: string[] = [];
  if (task.assigned_to) assignedIds.push(String(task.assigned_to));
  if (task.metadata?.assigned_users) {
    task.metadata.assigned_users.forEach((id: unknown) => assignedIds.push(String(id)));
  }

  const assignedMembers = members.filter((m) => assignedIds.includes(String(m.id)));

  if (assignedMembers.length === 0 && task.assignee) {
    assignedMembers.push(task.assignee);
  }

  if (assignedMembers.length === 0) {
    return <span className="text-xs italic text-muted-foreground">Sin asignar</span>;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {assignedMembers.map((member) => {
          const initials = member.name
            ? member.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
            : "U";

          return (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 cursor-pointer border-2 border-card shadow-sm">
                  <AvatarImage src={member.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-semibold">{member.name}</p>
                <p className="text-[10px] opacity-70">{member.email}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

/* ------------------------------------------------------------------ */
/* Celebración al completar una tarea                                 */
/* ------------------------------------------------------------------ */

const CONFETTI_COLORS = ["var(--primary)", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#f43f5e"];

export function TaskCompletionCelebration({
  x,
  y,
  taskName,
  onDone,
}: {
  x: number;
  y: number;
  taskName: string;
  onDone: () => void;
}) {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.4;
      const distance = 70 + Math.random() * 150;
      return {
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 50,
        rot: Math.random() * 720 - 360,
        delay: Math.random() * 90,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w: 6 + Math.random() * 5,
        h: 4 + Math.random() * 6,
        round: i % 3 === 0,
      };
    })
  );

  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-live="polite">
      <style>{`
        @keyframes yel-confetti {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translate(var(--dx), calc(var(--dy) + 150px)) rotate(var(--rot)) scale(0.6); opacity: 0; }
        }
        @keyframes yel-ring {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(3.2); opacity: 0; }
        }
        @keyframes yel-banner {
          0% { transform: translate(-50%, -28px) scale(0.96); opacity: 0; }
          12% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          84% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -14px) scale(0.98); opacity: 0; }
        }
        @keyframes yel-pop {
          0% { transform: scale(0); }
          60% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .yel-confetti, .yel-ring { display: none; }
        }
      `}</style>

      {/* Anillo en el punto donde se hizo clic */}
      <span
        className="yel-ring absolute h-8 w-8 rounded-full border-2 border-emerald-500"
        style={{ left: x, top: y, animation: "yel-ring 0.8s ease-out forwards" }}
      />

      {/* Confeti */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="yel-confetti absolute"
          style={
            {
              left: x,
              top: y,
              width: p.w,
              height: p.h,
              background: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              animation: `yel-confetti 1.5s cubic-bezier(0.2, 0.7, 0.3, 1) ${p.delay}ms forwards`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
            } as CSSProperties
          }
        />
      ))}

      {/* Aviso */}
      <div
        className="absolute left-1/2 top-6 flex max-w-[90vw] items-center gap-3 rounded-2xl border border-emerald-200 bg-card px-4 py-3 shadow-xl dark:border-emerald-500/30"
        style={{ animation: "yel-banner 2.8s ease-in-out forwards" }}
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
          style={{ animation: "yel-pop 0.5s ease-out 0.1s both" }}
        >
          <Check className="h-5 w-5" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">¡Tarea completada!</p>
          <p className="max-w-[260px] truncate text-xs text-muted-foreground">{taskName}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel lateral de hitos                                             */
/* ------------------------------------------------------------------ */

export function MilestonesSheet({
  open,
  onOpenChange,
  tasks,
  members = [],
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: OrgProjectTask[];
  members?: TaskColumnProps["members"];
  onSelect: (task: OrgProjectTask) => void;
}) {
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

/* ------------------------------------------------------------------ */
/* Tabla compacta agrupada por fases                                  */
/* ------------------------------------------------------------------ */

const TABLE_HEADERS = [
  "Tarea",
  "Responsables",
  "Departamento",
  "Fechas",
  "Vencimiento",
  "Estatus",
  "Notas",
  "",
];

const CELL = "px-3 py-2 align-middle";

export function TaskPhaseTable({
  tasks,
  allTasks,
  members = [],
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  tasks: OrgProjectTask[];
  allTasks: OrgProjectTask[];
  members?: TaskColumnProps["members"];
  onEdit: TaskColumnProps["onEdit"];
  onDelete: TaskColumnProps["onDelete"];
  onToggleComplete: (task: OrgProjectTask, origin: { x: number; y: number }) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const groups = groupTasksByPhase(tasks, allTasks);

  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <p className="text-sm font-medium text-foreground">No hay tareas para mostrar</p>
        <p className="mt-1 text-xs text-muted-foreground">Cambia los filtros o crea una nueva tarea.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[27%]" />
            <col className="w-[9%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[11%]" />
            <col className="w-[13%]" />
            <col className="w-[4%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-border bg-muted/55">
              {TABLE_HEADERS.map((header, i) => (
                <th
                  key={i}
                  className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {groups.map((group) => {
            const isCollapsed = !!collapsed[group.key];
            const pct = group.total > 0 ? Math.round((group.done / group.total) * 100) : 0;
            const color = PHASE_COLORS[group.key] ?? PHASE_COLORS.general;

            return (
              <tbody key={group.key}>
                {/* Cabecera de fase */}
                <tr className={`border-y ${color.border} ${color.header}`}>
                  <td colSpan={TABLE_HEADERS.length} className="p-0">
                    <button
                      type="button"
                      onClick={() => toggle(group.key)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${color.hover}`}
                    >
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-300 ${color.text} ${
                          isCollapsed ? "-rotate-90" : ""
                        }`}
                      />
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color.dot}`} />
                      <span className="text-sm font-semibold text-foreground">{group.label}</span>
                      <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {group.items.length} {group.items.length === 1 ? "tarea" : "tareas"}
                      </span>
                      {group.milestones > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          ◆ {group.milestonesDone}/{group.milestones} hitos
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-background/80">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${color.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-xs font-semibold text-muted-foreground">
                          {pct}%
                        </span>
                      </div>
                    </button>
                  </td>
                </tr>

                {/* Filas */}
                {!isCollapsed &&
                  group.items.map((task, index) => {
                    const due = getDueInfo(task);
                    const done = task.status === "completed";
                    const metadata = task.metadata || {};
                    const spent = metadata.spent ? Number(metadata.spent) : 0;
                    const accent =
                      due?.key === "overdue"
                        ? "border-l-destructive"
                        : due?.key === "today" || due?.key === "soon"
                          ? "border-l-amber-500"
                          : "border-l-transparent";

                    return (
                      <tr
                        key={task.uid}
                        onClick={() => onEdit(task)}
                        style={{ animationDelay: `${index * 35}ms` }}
                        className="group animate-in fade-in-0 cursor-pointer border-b border-border duration-300 fill-mode-backwards transition-colors hover:bg-muted/50"
                      >
                        {/* Tarea */}
                       {/* Tarea */}
<td className={`${CELL} border-l-[3px] ${accent} relative`}>
  {/* Conector tipo rama / hilo */}
  <div className="absolute -left-3 top-0 bottom-1/2 w-3 border-l-2 border-b-2 border-muted-foreground/25 rounded-bl-lg pointer-events-none" />

  {/* Contenedor con sangría a la izquierda (pl-4) */}
  <div className="flex min-w-0 items-center gap-2 pl-4">
    <button
      type="button"
      title={done ? "Reabrir tarea" : "Marcar como completada"}
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        onToggleComplete(task, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-110 ${
        done
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-muted-foreground/40 text-transparent hover:border-emerald-500 hover:text-emerald-500"
      }`}
    >
      <Check className="h-3 w-3" strokeWidth={3} />
    </button>
    {task.is_milestone && (
      <span
        title="Hito importante"
        className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
      >
        ◆ Hito
      </span>
    )}
    <span
      title={task.name}
      className={`truncate font-medium text-xs sm:text-sm ${
        done ? "text-muted-foreground line-through" : "text-foreground"
      }`}
    >
      {task.name}
    </span>
    {task.platform && (
      <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium capitalize text-primary">
        {task.platform.replace("_", " ")}
      </span>
    )}
  </div>
</td>

                        {/* Responsables */}
                        <td className={CELL} onClick={(e) => e.stopPropagation()}>
                          <AssigneeAvatars task={task} members={members} />
                        </td>

                        {/* Departamento */}
                        <td className={CELL}>
                          <TaskDepartmentBadge department={task.department} />
                        </td>

                        {/* Fechas */}
                        <td className={`${CELL} whitespace-nowrap text-xs font-medium text-muted-foreground`}>
                          {formatDateRange(task)}
                        </td>

                        {/* Vencimiento */}
                        <td className={CELL}>
                          {due ? (
                            <TaskDueBadge task={task} />
                          ) : (
                            <span className="text-xs text-muted-foreground/60">—</span>
                          )}
                        </td>

                        {/* Estatus */}
                        <td className={CELL}>
                          <TaskStatusBadge status={task.status} />
                        </td>

                        {/* Notas / Inversión */}
                        <td className={CELL}>
                          <div className="flex min-w-0 items-center gap-2 text-xs">
                            {spent > 0 && (
                              <span className="flex shrink-0 items-center font-semibold text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="h-3 w-3" />
                                {spent.toLocaleString()}
                              </span>
                            )}
                            {metadata.notes ? (
                              <span className="truncate text-muted-foreground" title={metadata.notes}>
                                {metadata.notes}
                              </span>
                            ) : (
                              spent === 0 && (
                                <span className="italic text-muted-foreground/60">Sin notas</span>
                              )
                            )}
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className={CELL} onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onEdit(task)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => onDelete(task.uid)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}