"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrgEventService, OrgEvent, EventRegistration } from "@/services/events/org-event.service";
import { Loader2, ArrowLeft, Calendar, MapPin, Users, Link as LinkIcon, Radio, UserCheck, UserX, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";
import { AttendeesTable } from "@/components/events/attendees-table";
import { toast } from "sonner";

export default function EventDetailsPage() {
    const { workspaceUid, eventUid } = useParams() as { workspaceUid: string; eventUid: string };
    const router = useRouter();

    const [event, setEvent] = useState<OrgEvent | null>(null);
    const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedUid, setCopiedUid] = useState(false);

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

    // Cálculo dinámico de las métricas del evento
    const kpiItems: KpiItem[] = useMemo(() => {
        const totalRegistered = registrations.length;
        const totalAttended = registrations.filter(r => r.status === "attended").length;
const totalUnattended = registrations.filter(r => r.status === "registered").length;
        return [
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
    }, [registrations]);

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

            {/* Header del Evento */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${isPast ? 'bg-slate-300' : 'bg-indigo-500'}`} />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3">
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
                            <p className="text-slate-600 max-w-2xl leading-relaxed">
                                {event.description}
                            </p>
                        )}
                    </div>

                    {/* Tarjeta lateral con fechas, ubicación y el UID para Meta Ads */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 min-w-[300px] space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
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
                            <div className="bg-white p-2 rounded-lg shadow-sm">
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
                                    <a href={event.meeting_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline flex items-center gap-1 mt-1">
                                        <LinkIcon className="h-3 w-3" /> Unirse a la reunión
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Bloque para copiar el UID del Evento para Meta Ads / GHL */}
                        <div className="pt-3 border-t border-slate-200">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">UID para Meta Ads (GHL)</p>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs">
                                <span className="text-xs font-mono text-slate-600 truncate max-w-[200px]" title={event.uid}>
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
                    </div>
                </div>
            </div>

            {/* --- TARJETAS KPI DE ASISTENCIA DEL EVENTO --- */}
            <KpiCards items={kpiItems} columns="sm:grid-cols-3" />

            {/* TABS DE NAVEGACIÓN */}
            <Tabs defaultValue="attendees" className="w-full">
                <TabsList className="bg-white border shadow-sm rounded-lg p-1 mb-6">
                    <TabsTrigger value="attendees" className="rounded-md data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium">
                        <Users className="h-4 w-4 mr-2" />
                        Asistentes ({registrations.length})
                    </TabsTrigger>
                    <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium">
                        Resumen
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="attendees" className="mt-0">
                    <AttendeesTable registrations={registrations} />
                </TabsContent>

                <TabsContent value="overview" className="mt-0">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Métricas Detalladas</h3>
                        <p className="text-slate-500 text-sm">
                            Aquí puedes analizar el rendimiento de las campañas de marketing vinculadas a este evento y la tasa de conversión final de asistencia.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}