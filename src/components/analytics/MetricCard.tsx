import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: string;
  icon: React.ElementType;
  iconColorClass?: string;
}

export function MetricCard({ title, value, subtitle, trend, icon: Icon, iconColorClass = "text-blue-500" }: MetricCardProps) {
  return (
    <Card className="shadow-sm border-none ring-1 ring-slate-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-slate-900">
            {typeof value === 'number' ? new Intl.NumberFormat('es-MX').format(value) : value}
          </h2>
          {trend && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}