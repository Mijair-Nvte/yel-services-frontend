
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Folder, Bell, Zap } from "lucide-react";

type Props = { stats: any };

export function DashboardStats({ stats }: Props) {
  const items = [
    { 
      label: "Usuarios", 
      value: stats.users, 
      icon: Users, 
      color: "text-blue-600",
      iconBg: "bg-blue-100",
      cardBg: "bg-blue-50/50 dark:bg-blue-950/20",
      hoverShadow: "hover:shadow-blue-500/20",
      borderColor: "hover:border-blue-400"
    },
    { 
      label: "Eventos Totales", 
      value: stats.events_total, 
      icon: Calendar, 
      color: "text-purple-600",
      iconBg: "bg-purple-100",
      cardBg: "bg-purple-50/50 dark:bg-purple-950/20",
      hoverShadow: "hover:shadow-purple-500/20",
      borderColor: "hover:border-purple-400"
    },
    { 
      label: "Este Mes", 
      value: stats.events_this_month, 
      icon: Zap, 
      color: "text-amber-600",
      iconBg: "bg-amber-100",
      cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
      hoverShadow: "hover:shadow-amber-500/20",
      borderColor: "hover:border-amber-400"
    },
    { 
      label: "Documentos", 
      value: stats.documents_total, 
      icon: FileText, 
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
      cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
      hoverShadow: "hover:shadow-emerald-500/20",
      borderColor: "hover:border-emerald-400"
    },
    { 
      label: "Carpetas", 
      value: stats.folders_total, 
      icon: Folder, 
      color: "text-indigo-600",
      iconBg: "bg-indigo-100",
      cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
      hoverShadow: "hover:shadow-indigo-500/20",
      borderColor: "hover:border-indigo-400"
    },
    { 
      label: "Avisos", 
      value: stats.notices_total, 
      icon: Bell, 
      color: "text-rose-600",
      iconBg: "bg-rose-100",
      cardBg: "bg-rose-50/50 dark:bg-rose-950/20",
      hoverShadow: "hover:shadow-rose-500/20",
      borderColor: "hover:border-rose-400"
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Card 
          key={item.label} 
          className={`group transition-all duration-300 border-2 border-transparent shadow-sm ${item.cardBg} ${item.borderColor} ${item.hoverShadow} hover:-translate-y-1`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              {item.label}
            </CardTitle>
            <div className={`p-2 rounded-lg transition-transform group-hover:rotate-12 ${item.iconBg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-3xl font-black   group-hover:not-italic transition-all">
                {item.value}
              </span>
              <div className="mt-2 flex items-center gap-1">
                <div className={`h-1.5 w-1.5 rounded-full ${item.color.replace('text', 'bg')}`} />
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Workspace Activo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}