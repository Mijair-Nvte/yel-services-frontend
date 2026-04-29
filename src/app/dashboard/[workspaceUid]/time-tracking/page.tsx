"use client";

import { useParams } from "next/navigation";
import { useOrgTimeTracking } from "@/hooks/time_tracking/use-org-time-tracking";
import { cn } from "@/lib/utils"; 

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TimeTrackingPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const { records, loading } = useOrgTimeTracking(workspaceUid);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Control de Tiempo</h2>
        <p className="text-muted-foreground">
          Monitorea la actividad y asistencia del equipo.
        </p>
      </div>

      <Card className="rounded-xl border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/20 border-b border-border/60">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Registros Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="pr-6 text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell
                      colSpan={6}
                      className="h-16 bg-slate-50/50 dark:bg-slate-800/20"
                    />
                  </TableRow>
                ))
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No hay registros de tiempo todavía.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow
                    key={record.uid}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">
                          {record.user?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.started_at), "PPP", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      {format(new Date(record.started_at), "p")}
                    </TableCell>
                    <TableCell className="font-medium text-red-600">
                      {record.ended_at
                        ? format(new Date(record.ended_at), "p")
                        : "--:--"}
                    </TableCell>
                    <TableCell>
                      {record.duration_minutes
                        ? `${record.duration_minutes} min`
                        : "En curso..."}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {/* Aquí ajustamos los colores del Badge */}
                      <Badge
                        variant={record.status === "active" ? "default" : "secondary"}
                        className={cn(
                          "rounded-md px-2 py-1 uppercase text-[10px] font-bold tracking-wider",
                          record.status === "active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-200",
                        )}
                      >
                        {record.status === "active" ? "En línea" : "Completado"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}