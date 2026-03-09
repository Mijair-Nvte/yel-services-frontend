"use client";

import { useParams } from "next/navigation";

import { useDashboard } from "@/hooks/dashboard/use-dashboard";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardEvents } from "@/components/dashboard/dashboard-events";
import { DashboardNotices } from "@/components/dashboard/dashboard-notices";

export default function WorkspaceHomePage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  const { data, loading } = useDashboard(workspaceUid);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Cargando dashboard...</div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <DashboardStats stats={data.stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardEvents events={data.upcoming_events} />
        <DashboardNotices notices={data.recent_notices} />
      </div>
    </div>
  );
}
