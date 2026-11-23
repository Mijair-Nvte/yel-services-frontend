"use client";

import { useMemo } from "react";
import { DollarSign, ListChecks, CheckCircle2, Hourglass } from "lucide-react";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";
import { OrgProjectTask } from "@/services/projects/org-task.service";
import { getDueInfo, groupTasksByPhase } from "@/components/projects/tasks-columns";

export function ProjectSummary({ tasks }: { tasks: OrgProjectTask[] }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const count = (status: string) => tasks.filter((t) => t.status === status).length;

    const completed = count("completed");
    const inProgress = count("in_progress");
    const review = count("review");
    const pending = total - completed - inProgress - review;
    const remaining = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const overdue = tasks.filter((t) => getDueInfo(t)?.key === "overdue").length;

    const totalSpent = tasks.reduce(
      (acc, t) => acc + (t.metadata?.spent ? Number(t.metadata.spent) : 0),
      0
    );
    const totalLeads = tasks.reduce(
      (acc, t) => acc + (t.metadata?.leads ? Number(t.metadata.leads) : 0),
      0
    );

    return {
      total,
      completed,
      inProgress,
      review,
      pending,
      remaining,
      progress,
      overdue,
      totalSpent,
      totalLeads,
    };
  }, [tasks]);

  const kpiItems: KpiItem[] = useMemo(
    () => [
      {
        label: "Total de tareas",
        value: stats.total,
        icon: ListChecks,
        color: "text-primary",
        iconBg: "bg-primary/10",
        cardBg: "bg-primary/5",
        hoverShadow: "hover:shadow-primary/20",
        borderColor: "hover:border-primary/40",
        subtitle: "Acciones planificadas",
      },
      {
        label: "Completadas",
        value: stats.completed,
        icon: CheckCircle2,
        color: "text-emerald-600",
        iconBg: "bg-emerald-100",
        cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
        hoverShadow: "hover:shadow-emerald-500/20",
        borderColor: "hover:border-emerald-400",
        subtitle: `${stats.progress}% del proyecto`,
      },
      {
        label: "Por completar",
        value: stats.remaining,
        icon: Hourglass,
        color: "text-amber-600",
        iconBg: "bg-amber-100",
        cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
        hoverShadow: "hover:shadow-amber-500/20",
        borderColor: "hover:border-amber-400",
        subtitle: `${stats.pending} pend. · ${stats.inProgress} en proceso · ${stats.review} en revisión`,
      },
      {
        label: "Inversión acumulada",
        value: `$${stats.totalSpent.toLocaleString()}`,
        icon: DollarSign,
        color: "text-blue-600",
        iconBg: "bg-blue-100",
        cardBg: "bg-blue-50/50 dark:bg-blue-950/20",
        hoverShadow: "hover:shadow-blue-500/20",
        borderColor: "hover:border-blue-400",
        subtitle: `${stats.totalLeads} leads captados`,
      },
    ],
    [stats]
  );

  const segments = [
    { key: "completed", value: stats.completed, color: "bg-emerald-500", label: "Completadas" },
    { key: "review", value: stats.review, color: "bg-amber-500", label: "En revisión" },
    { key: "in_progress", value: stats.inProgress, color: "bg-blue-500", label: "En proceso" },
    { key: "pending", value: stats.pending, color: "bg-muted-foreground/40", label: "Pendientes" },
  ];

  const phases = useMemo(() => groupTasksByPhase(tasks, tasks), [tasks]);

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* KPIs */}
      <KpiCards items={kpiItems} columns="sm:grid-cols-2 lg:grid-cols-4" />

      {/* Avance general */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avance general del proyecto</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{stats.progress}%</p>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{stats.completed}</span> de{" "}
            <span className="font-semibold text-foreground">{stats.total}</span> tareas completadas
          </p>
        </div>

        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          {segments.map((s) => (
            <div
              key={s.key}
              className={`${s.color} transition-all duration-700`}
              style={{ width: stats.total > 0 ? `${(s.value / stats.total) * 100}%` : "0%" }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
              {s.label}
              <span className="font-semibold text-foreground">{s.value}</span>
            </div>
          ))}
          {stats.overdue > 0 && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              Vencidas
              <span className="font-semibold">{stats.overdue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Avance por fase */}
      {phases.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Avance por fase</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {phases.map((phase) => {
              const pct = phase.total > 0 ? Math.round((phase.done / phase.total) * 100) : 0;
              return (
                <div
                  key={phase.key}
                  className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{phase.label}</p>
                    <span className="text-sm font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/80">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {phase.done}/{phase.total} tareas
                    </span>
                    {phase.milestones > 0 && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                        ◆ {phase.milestonesDone}/{phase.milestones} hitos
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}