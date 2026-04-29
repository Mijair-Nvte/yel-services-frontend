"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { useTimeTracking } from "@/hooks/time_tracking/use-time-tracking";
import { useWorkspaceStore } from "@/store/workspace.store";
import { cn } from "@/lib/utils";

export function TimeTrackingWidget() {
  const { workspace } = useWorkspaceStore();
  const {
    isTracking,
    sessionData,
    loading,
    actionLoading,
    handleCheckIn,
    handleCheckOut,
  } = useTimeTracking(workspace?.uid);

  const [elapsed, setElapsed] = useState<string>("00:00:00");

  // Efecto para hacer correr el cronómetro en el Frontend
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && sessionData?.started_at) {
      const startTime = new Date(sessionData.started_at).getTime();

      interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - startTime;

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setElapsed(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 1000);
    } else {
      setElapsed("00:00:00");
    }

    return () => clearInterval(interval);
  }, [isTracking, sessionData]);

  // Evitamos renderizar basura mientras carga
  if (loading || !workspace?.uid) {
    return (
      <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isTracking ? (
        <div className="flex items-center bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-md overflow-hidden">
          <div className="px-3 text-sm font-mono font-medium text-red-600 dark:text-red-400">
            {elapsed}
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={actionLoading}
            onClick={() => handleCheckOut()}
            className="rounded-none h-9 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Square className="h-4 w-4 fill-current mr-1" />
            Salida
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={actionLoading}
          onClick={handleCheckIn}
          className="border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 transition-colors"
        >
          <Play className="h-4 w-4 fill-current mr-2" />
          Entrada
        </Button>
      )}
    </div>
  );
}
