"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Plus, LayoutList, LayoutDashboard, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectTasks } from "@/hooks/projects/use-project-tasks";
import { OrgProjectTask, SaveTaskDto } from "@/services/projects/org-task.service";
import { TaskDialog } from "@/components/projects/task-dialog";
import { ProjectSummary } from "@/components/projects/project-summary";
import {
  TaskPhaseTable,
  MilestonesSheet,
  TaskCompletionCelebration,
  getDueInfo,
} from "@/components/projects/tasks-columns";
import { OrgUserService } from "@/services/org_settings/users/org-user.service";
import { OrgEventService } from "@/services/events/org-event.service";

const STATUS_FILTERS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "in_progress", label: "En proceso" },
  { value: "review", label: "En revisión" },
  { value: "completed", label: "Completadas" },
  { value: "overdue", label: "Vencidas" },
];

function matchesFilter(task: OrgProjectTask, filter: string) {
  if (filter === "all") return true;
  if (filter === "overdue") return getDueInfo(task)?.key === "overdue";
  return task.status === filter;
}

export default function ProjectDetailPage() {
  const { workspaceUid, projectUid } = useParams() as { workspaceUid: string; projectUid: string };
  const router = useRouter();

  const { tasks, isLoading, loadTasks, createTask, updateTask, deleteTask } = useProjectTasks(
    workspaceUid,
    projectUid
  );

  const [members, setMembers] = useState<Awaited<ReturnType<typeof OrgUserService.getDirectory>>>([]);
  const [events, setEvents] = useState<Awaited<ReturnType<typeof OrgEventService.getAll>>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OrgProjectTask | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "summary">("list");
  const [milestonesOpen, setMilestonesOpen] = useState(false);
  const [celebration, setCelebration] = useState<{
    id: number;
    x: number;
    y: number;
    name: string;
  } | null>(null);

  // Cargar tareas y equipo al montar
  useEffect(() => {
    loadTasks();

    if (workspaceUid) {
      OrgUserService.getDirectory(workspaceUid)
        .then((data) => setMembers(data))
        .catch((err) => console.error("Error cargando equipo", err));

      OrgEventService.getAll(workspaceUid)
        .then((data) => setEvents(data))
        .catch((err) => console.error("Error cargando eventos", err));
    }
  }, [loadTasks, workspaceUid]);

  const celebrate = useCallback((x: number, y: number, name: string) => {
    setCelebration({ id: Date.now(), x, y, name });
  }, []);

  const handleCelebrationDone = useCallback(() => setCelebration(null), []);

  const handleSubmitTask = async (data: SaveTaskDto) => {
    const wasCompleted = selectedTask?.status === "completed";

    if (selectedTask) {
      await updateTask(selectedTask.uid, data);
    } else {
      await createTask(data);
    }

    // Celebrar si desde el formulario se marcó como completada
    if (data.status === "completed" && !wasCompleted) {
      celebrate(window.innerWidth / 2, window.innerHeight / 3, data.name);
    }
  };

  const handleEdit = useCallback((task: OrgProjectTask) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (uid: string) => {
      if (confirm("¿Estás seguro de eliminar esta tarea?")) {
        await deleteTask(uid);
      }
    },
    [deleteTask]
  );

  // Completar / reabrir desde el círculo de la tabla
  const handleToggleComplete = useCallback(
    async (task: OrgProjectTask, origin: { x: number; y: number }) => {
      const completing = task.status !== "completed";

      if (completing) celebrate(origin.x, origin.y, task.name);

      const payload: SaveTaskDto = {
        ...task,
        start_date: task.start_date ? task.start_date.substring(0, 10) : undefined,
        end_date: task.end_date ? task.end_date.substring(0, 10) : undefined,
        status: completing ? "completed" : "in_progress",
      };

      try {
        await updateTask(task.uid, payload);
      } catch (error) {
        setCelebration(null);
        toast.error(error instanceof Error ? error.message : "No se pudo actualizar la tarea");
      }
    },
    [celebrate, updateTask]
  );

  const handleSelectMilestone = useCallback(
    (task: OrgProjectTask) => {
      setMilestonesOpen(false);
      handleEdit(task);
    },
    [handleEdit]
  );

  // Tareas filtradas por chip de estatus + búsqueda
  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        matchesFilter(t, statusFilter) &&
        (q === "" || `${t.name} ${t.description ?? ""}`.toLowerCase().includes(q))
    );
  }, [tasks, statusFilter, search]);

  const countFor = (value: string) => tasks.filter((t) => matchesFilter(t, value)).length;

  const milestonesTotal = tasks.filter((t) => t.is_milestone).length;
  const milestonesDone = tasks.filter((t) => t.is_milestone && t.status === "completed").length;

  return (
    <div className="space-y-6 p-1">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/dashboard/${workspaceUid}/projects`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Detalle del Proyecto
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Gestiona las tareas, fases, responsables y resultados del proyecto.
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedTask(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Cargando tareas del proyecto...</p>
        </div>
      ) : (
        <>
          {/* Pestañas + hitos */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex w-fit rounded-lg border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${view === "list"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <LayoutList className="h-4 w-4" /> Lista
              </button>
              <button
                type="button"
                onClick={() => setView("summary")}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${view === "summary"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <LayoutDashboard className="h-4 w-4" /> Resumen
              </button>
            </div>

            <Button variant="outline" onClick={() => setMilestonesOpen(true)}>
              <span className="mr-2 text-amber-500">◆</span>
              Hitos
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                {milestonesDone}/{milestonesTotal}
              </span>
            </Button>
          </div>

          {/* Vista Resumen */}
          {view === "summary" && <ProjectSummary tasks={tasks} />}

          {/* Vista Lista */}
          {view === "list" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="relative w-full lg:max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar tarea..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-card pl-9"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((f) => {
                    const active = statusFilter === f.value;
                    return (
                      <Button
                        key={f.value}
                        type="button"
                        variant={active ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(f.value)}
                        className="gap-2 rounded-full px-4"
                      >
                        <span>{f.label}</span>
                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${active
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {countFor(f.value)}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <TaskPhaseTable
                tasks={filteredTasks}
                allTasks={tasks}
                members={members}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          )}
        </>
      )}

      {/* Panel lateral de hitos */}
      <MilestonesSheet
        open={milestonesOpen}
        onOpenChange={setMilestonesOpen}
        tasks={tasks}
        members={members}
        onSelect={handleSelectMilestone}
      />

      {/* Celebración al completar */}
      {celebration && (
        <TaskCompletionCelebration
          key={celebration.id}
          x={celebration.x}
          y={celebration.y}
          taskName={celebration.name}
          onDone={handleCelebrationDone}
        />
      )}

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitTask}
        taskToEdit={selectedTask}
        members={members}
        events={events}
      />
    </div>
  );
}