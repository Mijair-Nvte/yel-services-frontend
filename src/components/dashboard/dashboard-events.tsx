
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = { events: any[] };

export function DashboardEvents({ events }: Props) {
  return (
    <Card className="h-full border-2 border-transparent transition-all duration-300 bg-indigo-50/30 dark:bg-indigo-950/10 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <CalendarDays className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Próximos eventos</CardTitle>
              <CardDescription>Tu agenda para los próximos días.</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-900 bg-white/50 dark:bg-black/20">
            <p className="text-sm font-medium text-indigo-400">No hay eventos programados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.uid} 
                className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-border/50 transition-all hover:border-indigo-300 hover:shadow-md group/item"
              >
                <div className="flex flex-col items-center justify-center min-w-[55px] h-[55px] rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 transition-colors group-hover/item:bg-indigo-600">
                  <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 group-hover/item:text-white">
                    {new Date(event.starts_at).toLocaleDateString('es', { month: 'short' })}
                  </span>
                  <span className="text-xl font-black text-indigo-950 dark:text-white group-hover/item:text-white leading-none">
                    {new Date(event.starts_at).getDate()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate group-hover/item:text-indigo-600 transition-colors">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                    {new Date(event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Presencial
                  </p>
                </div>

                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}