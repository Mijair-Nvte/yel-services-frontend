"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MarketingTaskFieldsProps {
  platform: string;
  setPlatform: (val: string) => void;
  taskType: string;
  setTaskType: (val: string) => void;
  budget: string;
  setBudget: (val: string) => void;
  spent: string;
  setSpent: (val: string) => void;
  leads: string;
  setLeads: (val: string) => void;
  roas: string;
  setRoas: (val: string) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
}

// Opciones estrictas por plataforma para evitar errores de tipeo
const CONTENT_TYPES_BY_PLATFORM: Record<string, { label: string; value: string }[]> = {
  facebook: [
    { label: "Post / Imagen", value: "post" },
    { label: "Reel", value: "reel" },
    { label: "Story", value: "story" },
    { label: "Carrusel", value: "carrusel" },
    { label: "Pauta Publicitaria (Ads)", value: "pauta" },
  ],
  instagram: [
    { label: "Post / Imagen", value: "post" },
    { label: "Reel", value: "reel" },
    { label: "Story", value: "story" },
    { label: "Carrusel", value: "carrusel" },
    { label: "Pauta Publicitaria (Ads)", value: "pauta" },
  ],
  tiktok: [
    { label: "Video / Reel", value: "tiktok_video" },
    { label: "Story", value: "story" },
    { label: "Pauta Publicitaria (Ads)", value: "pauta" },
  ],
  google_my_business: [
    { label: "Post / Actualización", value: "gmb_post" },
    { label: "Optimización / Reseña", value: "gmb_optimization" },
  ],
};

export function MarketingTaskFields({
  platform,
  setPlatform,
  taskType,
  setTaskType,
  budget,
  setBudget,
  spent,
  setSpent,
  leads,
  setLeads,
  roas,
  setRoas,
  targetAudience,
  setTargetAudience,
}: MarketingTaskFieldsProps) {
  const currentContentTypes = CONTENT_TYPES_BY_PLATFORM[platform] || [
    { label: "Post", value: "post" },
    { label: "Pauta", value: "pauta" },
  ];

  const isPauta = taskType === "pauta";
  const labelClass = "text-sm font-medium text-foreground";

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card  p-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Redes sociales y contenido
      </h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 1. Plataforma */}
        <div className="space-y-2">
          <Label className={labelClass}>Plataforma</Label>
          <Select
            value={platform}
            onValueChange={(val) => {
              setPlatform(val);
              // Auto-seleccionar el primer formato disponible para esa plataforma
              const defaultType = CONTENT_TYPES_BY_PLATFORM[val]?.[0]?.value || "post";
              setTaskType(defaultType);
            }}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Selecciona plataforma..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="google_my_business">Google My Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. Tipo de contenido */}
        <div className="space-y-2">
          <Label className={labelClass}>Tipo de Contenido</Label>
          <Select value={taskType} onValueChange={setTaskType}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Selecciona formato..." />
            </SelectTrigger>
            <SelectContent>
              {currentContentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Si es Pauta, mostramos inversión y métricas */}
      {isPauta && (
        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
            Monitoreo de inversión y pauta
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className={labelClass}>Presupuesto Asignado ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                className="bg-background"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Inversión Real Gastada ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                className="bg-background"
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className={labelClass}>Leads Generados</Label>
              <Input
                type="number"
                placeholder="Ej: 45"
                className="bg-background"
                value={leads}
                onChange={(e) => setLeads(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>ROAS (Retorno)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ej: 3.5"
                className="bg-background"
                value={roas}
                onChange={(e) => setRoas(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className={labelClass}>Segmentación / Audiencia Objetivo</Label>
            <Input
              placeholder="Ej: Hombres/Mujeres 25-45, Intereses en Inversión"
              className="bg-background"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}