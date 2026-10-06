"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrgEventService, OrgEvent, EventRegistration } from "@/services/events/org-event.service";
import { Loader2, ArrowLeft, Calendar, MapPin, Users, Link as LinkIcon, Radio, UserCheck, UserX, Copy, Check, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";
import { EventSharePopover } from "@/components/events/event-share-popover";
import { AttendeesTable } from "@/components/events/attendees-table";
import { normalizeSource } from "@/components/events/attendees-columns";
import { toast } from "sonner";
import Image from "next/image";

export default function EventDetailsPage() {
    const { workspaceUid, eventUid } = useParams() as { workspaceUid: string; eventUid: string };
    const router = useRouter();

    const [event, setEvent] = useState<OrgEvent | null>(null);
    const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedUid, setCopiedUid] = useState(false);
    const [copiedAccessLink, setCopiedAccessLink] = useState(false);

    // 1. Enlace público principal para compartir (Siempre bajo /evento/ con UTMs)
    const publicEventUrl = event?.confirmation_url 
        ? event.confirmation_url.replace('/acceso/', '/evento/') 
        : "";

    // 2. Enlace de acceso al evento (Usa la ruta /acceso/ limpia, sin UTMs, para el mero día)
    const eventAccessUrl = event?.confirmation_url 
        ? event.confirmation_url.split('?')[0] 
        : "";

    const handleCopyAccessLink = async () => {
        if (!eventAccessUrl) return;
        try {
            await navigator.clipboard.writeText(eventAccessUrl);
            setCopiedAccessLink(true);
            toast.success("Enlace de acceso al evento copiado al portapapeles");
            setTimeout(() => setCopiedAccessLink(false), 2000);
        } catch (err) {
            toast.error("No se pudo copiar el enlace");
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setIsLoading(true);
                const [eventData, regsData] = await Promise.all([
                    OrgEventService.getOne(workspaceUid, eventUid),
                    OrgEventService.getRegistrations(workspaceUid, eventUid).catch(() => [])
                ]);

                setEvent(eventData);
                setRegistrations(regsData);
            } catch (error) {
                toast.error("Error al cargar los detalles del evento");
            } finally {
                setIsLoading(false);
            }
        };

        if (workspaceUid && eventUid) {
            fetchDetails();
        }
    }, [workspaceUid, eventUid]);

    const handleCopyEventUid = async () => {
        if (!event) return;
        try {
            await navigator.clipboard.writeText(event.uid);
            setCopiedUid(true);
            toast.success("UID del evento copiado al portapapeles");
            setTimeout(() => setCopiedUid(false), 2000);
        } catch (err) {
            toast.error("No se pudo copiar el UID");
        }
    };

    const sourceMetrics = useMemo(() => {
        const stats: Record<string, number> = {
            "Facebook": 0, "TikTok": 0, "Instagram": 0, "Google": 0, "Orgánico": 0, "Otros": 0
        };

        registrations.forEach(r => {
            const clean = normalizeSource(r.source);
            if (stats[clean] !== undefined) {
                stats[clean]++;
            } else {
                stats["Otros"]++;
            }
        });

        // Filtramos solo los que tienen al menos 1 y ordenamos de mayor a menor
        return Object.entries(stats)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
    }, [registrations]);
    
    // Cálculo dinámico de las métricas y fuentes del evento para los KPIs
    const kpiItems: KpiItem[] = useMemo(() => {
        const totalRegistered = registrations.length;
        const totalAttended = registrations.filter(r => r.status === "attended").length;
        const totalUnattended = registrations.filter(r => r.status === "registered").length;

        // Tarjetas base de asistencia
        const baseItems: KpiItem[] = [
            {
                label: "Total Registrados",
                value: totalRegistered,
                icon: Users,
                color: "text-blue-600",
                iconBg: "bg-blue-100",
                cardBg: "bg-blue-50/50 dark:bg-blue-950/20",
                hoverShadow: "hover:shadow-blue-500/20",
                borderColor: "hover:border-blue-400",
                subtitle: "Inscritos al evento",
            },
            {
                label: "Asistieron",
                value: totalAttended,
                icon: UserCheck,
                color: "text-emerald-600",
                iconBg: "bg-emerald-100",
                cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
                hoverShadow: "hover:shadow-emerald-500/20",
                borderColor: "hover:border-emerald-400",
                subtitle: "Participación confirmada",
            },
            {
                label: "No Asistieron",
                value: totalUnattended,
                icon: UserX,
                color: "text-slate-600",
                iconBg: "bg-slate-100",
                cardBg: "bg-slate-50/50 dark:bg-slate-950/20",
                hoverShadow: "hover:shadow-slate-500/20",
                borderColor: "hover:border-slate-400",
                subtitle: "Pendientes / Ausentes",
            }
        ];

        // Generamos tarjetas adicionales dinámicas por cada fuente detectada
        const sourceCards: KpiItem[] = sourceMetrics.map(([source, count]) => {
            return {
                label: `Origen: ${source}`,
                value: count,
                icon: Target,
                color: "text-indigo-600",
                iconBg: "bg-indigo-100",
                cardBg: "bg-indigo-50/30 dark:bg-indigo-950/20",
                hoverShadow: "hover:shadow-indigo-500/20",
                borderColor: "hover:border-indigo-400",
                subtitle: `Leads de ${source}`,
            };
        });

        return [...baseItems, ...sourceCards];
    }, [registrations, sourceMetrics]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-slate-500 text-sm font-medium">Cargando detalles del evento...</p>
            </div>
        );
    }

    if (!event) return null;

    const isPast = new Date(event.starts_at) < new Date();
    const eventStatus = !event.is_active ? "Inactivo" : isPast ? "Finalizado" : "Próximo";
    const imageUrl = event.cover_image_url || event.banner_image_url;

    return (
        <div className="space-y-6 p-1">
            {/* Botón de regreso */}
            <Button
                variant="ghost"
                className="text-slate-500 hover:text-slate-800 -ml-2 mb-2"
                onClick={() => router.push(`/dashboard/${workspaceUid}/events`)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Volver a eventos
            </Button>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 z-10 ${isPast ? 'bg-slate-300' : 'bg-indigo-500'}`} />

                <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                        {/* COLUMNA IZQUIERDA: Información principal (Badges, Título, Descripción) */}
                        <div className="space-y-4 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className={`${isPast ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'} border-none uppercase tracking-wider text-[10px]`}>
                                    {eventStatus}
                                </Badge>
                                <Badge variant="outline" className="text-slate-500 uppercase tracking-wider text-[10px] border-slate-200">
                                    {event.target_platform.replace('_', ' ')}
                                </Badge>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {event.title}
                            </h1>

                            {event.description && (
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    {event.description}
                                </p>
                            )}
                        </div>

                        {/* COLUMNA DERECHA: Imagen de portada + Tarjeta de Fecha/Ubicación/UID */}
                        <div className="w-full lg:w-[360px] shrink-0 space-y-4">

                            {/* 📸 IMAGEN DE PORTADA A LA DERECHA */}
                            {imageUrl && (
                                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                                    <Image
                                        src={imageUrl}
                                        alt={event.title}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 360px"
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {/* Tarjeta lateral con fechas, ubicación y enlaces */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 space-y-4 shadow-2xs">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                        <Calendar className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fecha y Hora</p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {new Date(event.starts_at).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {event.is_all_day ? "Todo el día" : new Date(event.starts_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                        {event.location === "En línea" ? (
                                            <Radio className="h-5 w-5 text-rose-500" />
                                        ) : (
                                            <MapPin className="h-5 w-5 text-emerald-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ubicación</p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {event.location || "Por definir"}
                                        </p>
                                        {event.meeting_url && (
                                            <a href={event.meeting_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline flex items-center gap-1 mt-1 font-medium">
                                                <LinkIcon className="h-3 w-3" /> Unirse a la reunión
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Bloque para copiar el UID del Evento para Meta Ads / GHL */}
                                <div className="pt-3 border-t border-slate-200">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">UID para Meta Ads (GHL)</p>
                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
                                        <span className="text-xs font-mono text-slate-600 truncate max-w-[180px]" title={event.uid}>
                                            {event.uid}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyEventUid}
                                            className="h-7 px-2 text-xs gap-1 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            {copiedUid ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                            {copiedUid ? "Copiado" : "Copiar"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Enlace Público para Compartir (Bajo la ruta /evento/ con UTMs para Redes) */}
                                {publicEventUrl && (
                                    <div className="pt-3 border-t border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                Compartir Evento (Redes con UTM)
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between bg-indigo-50/50 px-3 py-2 rounded-lg border border-indigo-100 shadow-2xs">
                                            <span className="text-xs font-mono text-indigo-700 truncate max-w-[170px]" title={publicEventUrl}>
                                                {publicEventUrl.replace(/^https?:\/\//, '')}
                                            </span>
                                            <EventSharePopover confirmationUrl={publicEventUrl} />
                                        </div>
                                    </div>
                                )}

                                {/* Enlace de Acceso al Evento (Ruta /acceso/ limpia para el mero día) */}
                                {eventAccessUrl && (
                                    <div className="pt-3 border-t border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                Enlace de Acceso al Evento
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
                                            <span className="text-xs font-mono text-slate-600 truncate max-w-[170px]" title={eventAccessUrl}>
                                                {eventAccessUrl.replace(/^https?:\/\//, '')}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCopyAccessLink}
                                                className="h-7 px-2 text-xs gap-1 border-slate-200 hover:bg-slate-100"
                                            >
                                                {copiedAccessLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                                {copiedAccessLink ? "Copiado" : "Copiar"}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* --- TARJETAS KPI DE ASISTENCIA DEL EVENTO --- */}
            <KpiCards items={kpiItems} columns="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />

            {/* TABS DE NAVEGACIÓN */}
            <Tabs defaultValue="attendees" className="w-full">
                <TabsList className="bg-white border shadow-sm rounded-lg p-1 mb-6">
                    <TabsTrigger value="attendees" className="rounded-md data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium">
                        <Users className="h-4 w-4 mr-2" />
                        Registros ({registrations.length})
                    </TabsTrigger>
                    <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium">
                        Resumen
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="attendees" className="mt-0">
                    <AttendeesTable registrations={registrations} />
                </TabsContent>

                <TabsContent value="overview" className="mt-0 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Rendimiento de Adquisición</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Distribución de asistentes según la campaña o plataforma de origen.
                        </p>

                        {sourceMetrics.length === 0 ? (
                            <p className="text-slate-400 text-sm py-4">Aún no hay datos suficientes para mostrar métricas.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {sourceMetrics.map(([source, count]) => {
                                    const percentage = Math.round((count / registrations.length) * 100);
                                    return (
                                        <div key={source} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{source}</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-slate-800">{count}</span>
                                                <span className="text-xs font-medium text-slate-500">leads</span>
                                            </div>
                                            {/* Pequeña barra de progreso visual */}
                                            <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-indigo-500 h-1.5 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-1.5 font-medium text-right">{percentage}% del total</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}