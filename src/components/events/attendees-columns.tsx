"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { EventRegistration, OrgEventService } from "@/services/events/org-event.service";
import { ExternalLink, UserCheck, Mail, Phone, Target, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
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

export const CONTACT_STATUSES = {
    pending: { label: "Pendiente", color: "bg-slate-100 text-slate-600" },
    contacted: { label: "Contactado", color: "bg-blue-100 text-blue-700" },
    no_answer: { label: "No Respondió", color: "bg-amber-100 text-amber-700" },
    follow_up_1w: { label: "Seguimiento 1 sem", color: "bg-indigo-100 text-indigo-700" },
    follow_up_1m: { label: "Seguimiento 1 mes", color: "bg-purple-100 text-purple-700" },
    not_interested: { label: "No Interesado", color: "bg-rose-100 text-rose-700" },
};


export function ContactStatusCell({ workspaceUid, eventUid, registration }: { workspaceUid: string; eventUid: string; registration: EventRegistration }) {
    const [status, setStatus] = useState(registration.contact_status || "pending");
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        try {
            await OrgEventService.updateContactStatus(workspaceUid, eventUid, registration.uid, {
                contact_status: newStatus,
            });
            setStatus(newStatus);
            toast.success("Estado de contacto actualizado");
        } catch (error) {
            toast.error("Error al actualizar el estado");
        } finally {
            setIsLoading(false);
        }
    };



    const currentConfig = CONTACT_STATUSES[status as keyof typeof CONTACT_STATUSES] || CONTACT_STATUSES.pending;

    return (
        <div className="flex items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
                <SelectTrigger className={`h-7 text-xs font-medium border-none shadow-none focus:ring-0 ${currentConfig.color} w-[140px]`}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(CONTACT_STATUSES).map(([key, config]) => (
                        <SelectItem key={key} value={key} className="text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${config.color.split(' ')[0]}`} />
                                {config.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isLoading && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
        </div>
    );
}

interface AttendeesColumnsProps {
    onDelete?: (reg: EventRegistration) => void;
    workspaceUid: string;
    eventUid: string;
}

export const getAttendeesColumns = ({ onDelete, workspaceUid, eventUid }: AttendeesColumnsProps): ColumnDef<EventRegistration>[] => [
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
        id: "contact_status",
        header: "Seguimiento",
        cell: ({ row }) => (
            <ContactStatusCell
                workspaceUid={workspaceUid}
                eventUid={eventUid}
                registration={row.original}
            />
        )
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
        header: () => <div className="text-right pr-4">CRM / Acciones</div>, // 👇 Ajustamos el título
        cell: ({ row }) => {
            const customer = row.original.customer;
            const locationId = process.env.NEXT_PUBLIC_GHL_LOCATION_ID;
            const ghlUrl = customer?.ghl_contact_id && locationId
                ? `https://app.ideashubai.com/v2/location/${locationId}/contacts/detail/${customer.ghl_contact_id}`
                : null;

            return (
                // 👇 Modificamos el div para incluir tanto el botón del CRM como el Dropdown de Acciones
                <div className="flex items-center justify-end gap-2 pr-2">
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

                    {/* 👇 Agregamos tu componente reutilizable DataTableRowActions */}
                    <DataTableRowActions
                        row={row}
                        onDelete={onDelete ? (data) => onDelete(data as EventRegistration) : undefined}
                    />
                </div>
            );
        },
    },
];