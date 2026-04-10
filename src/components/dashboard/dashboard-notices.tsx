
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BellRing, ChevronRight } from "lucide-react";

type Props = { notices: any[] };

export function DashboardNotices({ notices }: Props) {
  return (
    <Card className="h-full border-2 border-transparent transition-all duration-300 bg-amber-50/30 dark:bg-amber-950/10 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 group">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
            <BellRing className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Avisos recientes</CardTitle>
            <CardDescription>Comunicación interna importante.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notices.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-amber-600/60">Sin avisos por el momento</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div 
                key={notice.uid} 
                className="group/notice relative flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-border/40 hover:border-amber-200 transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <div>
                    <h4 className="text-sm font-bold leading-none group-hover/notice:text-amber-600 transition-colors">
                      {notice.title}
                    </h4>
                    <p className="text-[11px] font-medium text-muted-foreground mt-2 uppercase tracking-tighter">
                      Publicado • {new Date(notice.created_at).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover/notice:text-amber-600 group-hover/notice:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}