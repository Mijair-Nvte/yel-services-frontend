"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Users, Globe, MapPin } from 'lucide-react';

interface AudienceProps {
  genderAgeData?: any[];
  countriesData?: any[];
  citiesData?: any[];
}

const chartConfig = {
  count: {
    label: "Personas",
    color: "#1877F2",
  },
} satisfies ChartConfig;

export function AudienceDemographics({ genderAgeData = [], countriesData = [], citiesData = [] }: AudienceProps) {
  
  // Transformar datos de Género y Edad que vienen de Meta (ej. "F.25-34" => 120) para Recharts
  const formattedGenderAge = Object.entries(genderAgeData || {}).map(([key, value]) => {
    const [gender, ageRange] = key.split('.');
    let genderLabel = gender === 'F' ? 'Mujeres' : gender === 'M' ? 'Hombres' : 'Otro';
    return {
      category: `${genderLabel} (${ageRange})`,
      personas: value,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* GRÁFICA DE EDAD Y GÉNERO */}
      <Card className="shadow-sm border-none ring-1 ring-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Distribución por Edad y Género</CardTitle>
              <CardDescription>Segmentación demográfica de tu audiencia actual</CardDescription>
            </div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          {formattedGenderAge.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
              <BarChart data={formattedGenderAge} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} width={100} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="personas" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-slate-400 text-sm">
              No hay datos demográficos disponibles todavía.
            </div>
          )}
        </CardContent>
      </Card>

      {/* TOP PAÍSES Y CIUDADES */}
      <Card className="shadow-sm border-none ring-1 ring-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Ubicación Geográfica</CardTitle>
              <CardDescription>Principales ciudades y países de tus seguidores</CardDescription>
            </div>
            <Globe className="w-5 h-5 text-indigo-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Ciudades */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Top Ciudades
            </h4>
            <div className="space-y-2">
              {citiesData && Object.keys(citiesData).length > 0 ? (
                Object.entries(citiesData).slice(0, 4).map(([city, count]: [string, any]) => (
                  <div key={city} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50 border">
                    <span className="font-medium text-slate-700">{city}</span>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{count} fans</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Sin registros de ciudades.</p>
              )}
            </div>
          </div>

          {/* Países */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Top Países
            </h4>
            <div className="space-y-2">
              {countriesData && Object.keys(countriesData).length > 0 ? (
                Object.entries(countriesData).slice(0, 3).map(([country, count]: [string, any]) => (
                  <div key={country} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50 border">
                    <span className="font-medium text-slate-700">{country}</span>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">{count} fans</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Sin registros de países.</p>
              )}
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}