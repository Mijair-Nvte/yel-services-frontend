import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface KpiItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  iconBg: string;
  cardBg: string;
  hoverShadow: string;
  borderColor: string;
  subtitle?: string;
}

type Props = {
  items: KpiItem[];
  columns?: string; 
};

export function KpiCards({ items, columns = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" }: Props) {
  return (
    <div className={`grid gap-4 ${columns}`}>
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
              <span className="text-3xl font-black group-hover:not-italic transition-all">
                {item.value}
              </span>
              <div className="mt-2 flex items-center gap-1">
                <div className={`h-1.5 w-1.5 rounded-full ${item.color.replace('text', 'bg')}`} />
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  {item.subtitle || "Workspace Activo"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}