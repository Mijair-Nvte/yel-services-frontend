"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/services/http';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Facebook, Users, Eye, Activity, MousePointerClick, ExternalLink, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Importamos el componente reutilizable de tarjetas métricas
import { MetricCard } from '@/components/analytics/MetricCard';
import { AudienceDemographics } from '@/components/analytics/AudienceDemographics';

const chartConfig = {
  alcance: { label: "Alcance", color: "#1877F2" },
  interacciones: { label: "Interacciones", color: "#F59E0B" },
} satisfies ChartConfig;

export default function MetaAnalyticsPage() {
  const params = useParams();
  const workspaceUid = params.workspaceUid as string;
  const [audienceData, setAudienceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (workspaceUid) {
      // 1. Cargar posts y métricas generales
      apiFetch(`/org-companies/${workspaceUid}/integrations/meta/analytics/posts`)
        .then(res => setData(res));

      // 2. Cargar datos demográficos de audiencia
      apiFetch(`/org-companies/${workspaceUid}/integrations/meta/analytics/audience`)
        .then(res => setAudienceData(res))
        .catch(err => console.error("Error al cargar audiencia:", err))
        .finally(() => setLoading(false));
    }
  }, [workspaceUid]);

  if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

  // Destructuramos la respuesta de la API
  const { account_info, metrics_summary, posts } = data || {};

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-sm border">
        {account_info?.avatar ? (
          <img src={account_info.avatar} alt="Logo" className="w-12 h-12 rounded-full border object-cover" />
        ) : (
          <div className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-xl"><Facebook className="h-7 w-7" /></div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{account_info?.name || 'Cargando...'}</h1>
          <p className="text-sm text-slate-500">Facebook Page Analytics & Demographics</p>
        </div>
      </div>

      {/* COMPONENTES REUTILIZABLES (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Comunidad (Seguidores)"
          value={account_info?.followers || 0}
          icon={Users}
          iconColorClass="text-blue-500"
        />
        <MetricCard
          title="Alcance Total (7 Días)"
          value={metrics_summary?.totals?.reach || 0}
          icon={Eye}
          iconColorClass="text-indigo-500"
        />
        <MetricCard
          title="Interacciones Totales"
          value={metrics_summary?.totals?.engagement || 0}
          icon={Activity}
          iconColorClass="text-orange-500"
        />
        <MetricCard
          title="Publicaciones Recientes"
          value={posts?.length || 0}
          icon={MousePointerClick}
          iconColorClass="text-pink-500"
        />
      </div>

      {/* GRÁFICA ALIMENTADA POR LA API */}
      {metrics_summary?.chart_data && (
        <Card className="shadow-sm border-none ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle>Rendimiento Orgánico</CardTitle>
            <CardDescription>Evolución de alcance e interacciones de los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics_summary.chart_data.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full mt-4">
                <LineChart data={metrics_summary.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="alcance" stroke="var(--color-alcance)" strokeWidth={3} />
                  <Line type="monotone" dataKey="interacciones" stroke="var(--color-interacciones)" strokeWidth={3} />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <p>No hay datos suficientes para graficar en este periodo.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AudienceDemographics
        genderAgeData={audienceData?.gender_age}
        countriesData={audienceData?.countries}
        citiesData={audienceData?.cities}
      />

      {/* HISTORIAL Y RENDIMIENTO DE PUBLICACIONES */}
      <Card className="shadow-sm border-none ring-1 ring-slate-200">
        <CardHeader>
          <CardTitle>Publicaciones Recientes</CardTitle>
          <CardDescription>Listado y multimedia de los posts extraídos de la página</CardDescription>
        </CardHeader>
        <CardContent>
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post: any) => {
                const imageUrl = post.attachments?.data?.[0]?.media?.image?.src;
                const mediaTitle = post.attachments?.data?.[0]?.title || 'Publicación sin título';
                const formattedDate = new Date(post.created_time).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-white shadow-xs">
                    <div className="flex items-center gap-4">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Media" className="w-16 h-16 rounded-lg object-cover border" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <Facebook className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-slate-800 line-clamp-1">{mediaTitle}</h4>
                        <p className="text-xs text-slate-400 mt-1">Publicado el: {formattedDate}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.comments?.summary?.total_count || 0} comentarios</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={post.permalink_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors self-end sm:self-center"
                    >
                      Ver en Facebook <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No se encontraron publicaciones recientes.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}