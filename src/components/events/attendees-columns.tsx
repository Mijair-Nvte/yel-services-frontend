"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { EventRegistration } from "@/services/events/org-event.service";
import { ExternalLink, UserCheck, Mail, Phone, Target, Search } from "lucide-react";
import { Button } from "@/components/ui/button";


export const normalizeSource = (rawSource?: string | null): string => {
    if (!rawSource) return "Orgánico";

    const s = rawSource.toLowerCase().trim();

    // Tolerancia a errores de dedo en Facebook / Meta
    if (s.includes("face") || s.includes("fb") || s.includes("meta") || s.includes("facebok")) return "Facebook";
    
    // Tolerancia a errores de dedo en TikTok
    if (s.includes("tik") || s.includes("tt") || s.includes("tik-tok")) return "TikTok";
    
    // Tolerancia a errores de dedo en Instagram (atrapa "instragram", "insta", "ig")
    if (s.includes("insta") || s.includes("ig") || s.includes("instrag") || s.includes("instarg")) return "Instagram";
    
    // Tolerancia a Google / Ads
    if (s.includes("google") || s.includes("ads") || s.includes("search") || s.includes("AdWords")) return "Google";
    
    // Tolerancia a tráfico orgánico / directo
    if (s.includes("organica") || s.includes("organica") || s.includes("directo") || s.includes("ya estoy listo") || s.includes("web") || s.includes("organic")) return "Orgánico";

    return "Otros"; 
};

export const getAttendeesColumns = (): ColumnDef<EventRegistration>[] => [
    {
        id: "name",
        header: "Nombre",
        accessorFn: (row) => row.customer ? `${row.customer.first_name} ${row.customer.last_name}` : "Desconocido",
        cell: ({ row }) => {
            const customer = row.original.customer;
            if (!customer) return <span className="text-slate-400 text-sm">Sin datos</span>;

            return (
                <div className="font-semibold text-slate-900 text-sm">
                    {customer.first_name} {customer.last_name}
                </div>
            );
        },
    },
    {
        id: "email",
        header: "Correo Electrónico",
        accessorFn: (row) => row.customer?.email || "",
        cell: ({ row }) => {
            const email = row.original.customer?.email;
            if (!email) return <span className="text-slate-400 text-sm">-</span>;

            return (
                <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-3.5 w-3.5 mr-2 text-slate-400 shrink-0" />
                    {email}
                </div>
            );
        },
    },
    {
        id: "phone",
        header: "Teléfono",
        accessorFn: (row) => row.customer?.phone || "",
        cell: ({ row }) => {
            const phone = row.original.customer?.phone;
            if (!phone) return <span className="text-slate-400 text-sm">-</span>;

            return (
                <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-3.5 w-3.5 mr-2 text-slate-400 shrink-0" />
                    {phone}
                </div>
            );
        },
    },
   {
        accessorKey: "source",
        header: "Origen (Campaña)",
        cell: ({ row }) => {
            const rawSource = row.original.source || "Directo";
            const cleanSource = normalizeSource(rawSource); 

            const sourceStyles: Record<string, string> = {
                "Facebook": "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20",
                "TikTok": "bg-slate-900 text-white border-slate-900",
                "Instagram": "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
                "Google": "bg-blue-50 text-blue-600 border-blue-200",
                "Orgánico": "bg-emerald-50 text-emerald-700 border-emerald-200",
                "Otros": "bg-slate-100 text-slate-600 border-slate-200",
            };

            return (
                <div className="space-y-1">
                    {/* Badge con la categoría limpia para lectura rápida */}
                    <Badge variant="outline" className={`font-medium shadow-none ${sourceStyles[cleanSource] || sourceStyles["Otros"]}`}>
                        {cleanSource === "Orgánico" || cleanSource === "Otros" ? (
                            <Search className="h-3 w-3 mr-1.5 opacity-70" />
                        ) : (
                            <Target className="h-3 w-3 mr-1.5 opacity-70" />
                        )}
                        {cleanSource}
                    </Badge>
                    
                    {/* Texto original exacto que llegó de la URL o base de datos */}
                    <div className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]" title={rawSource}>
                        Original: <span className="text-slate-600">{rawSource}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Estatus",
        cell: ({ row }) => {
            const status = row.original.status;

            // Configuración ajustada a la realidad operativa
            const config: Record<string, { bg: string; label: string }> = {
                attended: { bg: "bg-emerald-100 text-emerald-800", label: "Asistió" },
                registered: { bg: "bg-slate-100 text-slate-700", label: "Pendiente / No Asistió" },
            };

            const current = config[status] || config.registered;
            return <Badge className={`${current.bg} border-none shadow-none`}>{current.label}</Badge>;
        },
    },
    {
        accessorKey: "created_at",
        header: "Fecha de Registro",
        cell: ({ row }) => {
            return (
                <span className="text-sm text-slate-600 font-medium">
                    {new Date(row.original.created_at).toLocaleDateString('es-MX', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">CRM</div>,
        cell: ({ row }) => {
            const customer = row.original.customer;

            const locationId = process.env.NEXT_PUBLIC_GHL_LOCATION_ID;

            const ghlUrl = customer?.ghl_contact_id && locationId
                ? `https://app.ideashubai.com/v2/location/${locationId}/contacts/detail/${customer.ghl_contact_id}`
                : null;

            return (
                <div className="flex justify-end pr-2">
                    {ghlUrl ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            onClick={() => window.open(ghlUrl, '_blank')}
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver en CRM
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" disabled className="text-slate-400">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Local
                        </Button>
                    )}
                </div>
            );
        },
    },
];