
"use client";

import { useParams } from "next/navigation";
import { useDashboard } from "@/hooks/dashboard/use-dashboard";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardEvents } from "@/components/dashboard/dashboard-events";
import { DashboardNotices } from "@/components/dashboard/dashboard-notices";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function WorkspaceHomePage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { data, loading } = useDashboard(workspaceUid);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-sm animate-pulse text-muted-foreground font-medium">
          Preparando tu espacio de trabajo...
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
          <p className="text-muted-foreground">
            Bienvenido de nuevo. Aquí tienes un resumen de lo que sucede en tu workspace.
          </p>
        </div>
       
      </div>

      <DashboardStats stats={data.stats} />

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
          <DashboardEvents events={data.upcoming_events} />
        </div>
        <div className="md:col-span-3">
          <DashboardNotices notices={data.recent_notices} />
        </div>
      </div>
    </div>
  );
}