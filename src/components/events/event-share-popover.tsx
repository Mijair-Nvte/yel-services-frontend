"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Facebook, Instagram, Globe, Link2 } from "lucide-react";
import { toast } from "sonner";

// Definimos un ícono genérico para TikTok ya que Lucide no lo tiene por defecto
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

interface EventSharePopoverProps {
    confirmationUrl: string;
}

export function EventSharePopover({ confirmationUrl }: EventSharePopoverProps) {
    const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

    const shareOptions = [
        { id: "facebook", name: "Facebook", source: "facebook", icon: Facebook, color: "text-blue-600", bg: "bg-blue-50" },
        { id: "instagram", name: "Instagram", source: "instagram", icon: Instagram, color: "text-pink-600", bg: "bg-pink-50" },
        { id: "tiktok", name: "TikTok", source: "tiktok", icon: TikTokIcon, color: "text-slate-900", bg: "bg-slate-100" },
        { id: "web", name: "Sitio Web YEL", source: "web_yaestoylisto", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
        { id: "directo", name: "Link Directo (Sin UTM)", source: "", icon: Link2, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    const handleCopy = async (id: string, source: string) => {
        try {
            // Construimos la URL agregando el parámetro source si existe
            const url = new URL(confirmationUrl);
            if (source) {
                url.searchParams.set("source", source);
            }

            await navigator.clipboard.writeText(url.toString());

            setCopiedPlatform(id);
            toast.success(`Enlace para ${source || "compartir"} copiado`);

            setTimeout(() => {
                setCopiedPlatform(null);
            }, 2000);
        } catch (err) {
            toast.error("No se pudo copiar el enlace");
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs gap-1.5 border-indigo-200 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-indigo-600 transition-colors"
                >
                    <Share2 className="h-3.5 w-3.5" />
                    Compartir Link
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-64 p-2 rounded-xl shadow-xl animate-in zoom-in-95 fade-in-0 duration-200"
            >
                <div className="mb-2 px-2 pt-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Generar enlace para:
                    </p>
                </div>

                <div className="flex flex-col gap-1">
                    {shareOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleCopy(option.id, option.source)}
                            className="flex items-center justify-between w-full p-2 text-sm rounded-md hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md ${option.bg}`}>
                                    <option.icon className={`h-4 w-4 ${option.color}`} />
                                </div>
                                <span className="font-medium text-slate-700 group-hover:text-slate-900">
                                    {option.name}
                                </span>
                            </div>

                            {copiedPlatform === option.id ? (
                                <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in" />
                            ) : (
                                <Copy className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}