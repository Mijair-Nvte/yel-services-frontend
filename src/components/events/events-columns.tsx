"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OrgEvent } from "@/services/events/org-event.service";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { MapPin, Link as LinkIcon, Users, Eye, Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
interface EventColumnProps {
    onEdit: (event: OrgEvent) => void;
    onDelete: (uid: string) => void;
    onView: (event: OrgEvent) => void;
}

function CopyUidCell({ uid }: { uid: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(uid);
            setCopied(true);
            toast.success("UID copiado al portapapeles");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("No se pudo copiar el UID");
        }
    };

    return (
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md w-fit">
            <span className="text-xs font-mono text-slate-600 truncate max-w-[120px]">
                {uid}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-indigo-600 p-0"
                onClick={handleCopy}
                title="Copiar UID para Meta Ads"
            >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </Button>
        </div>
    );
}

export const getEventColumns = ({ onEdit, onDelete, onView }: EventColumnProps): ColumnDef<OrgEvent>[] => [
    {
        accessorKey: "starts_at",
        header: "Fecha",
        cell: ({ row }) => {
            const date = new Date(row.original.starts_at);
            return (
                <div>
                    <span className="text-sm font-medium text-slate-900 block">
                        {date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-slate-500">
                        {row.original.is_all_day ? "Todo el día" : date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            );
        },
    },
    {
        id: "title",
        header: "Evento",
        accessorFn: (row) => row.title,
        cell: ({ row }) => {
            const ev = row.original;
            return (
                <div>

                    <div
                        className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer transition-colors"
                        onClick={() => onView(ev)}
                    >
                        {ev.title}
                    </div>
                </div>
            );
        },
    },
    {
        id: "uid_column",
        header: "UID Evento",
        cell: ({ row }) => <CopyUidCell uid={row.original.uid} />,
    },
    {
        id: "location",
        header: "Ubicación",
        accessorFn: (row) => row.location || row.meeting_url || "Por definir",
        cell: ({ row }) => {
            const ev = row.original;
            const isVirtual = !!ev.meeting_url && !ev.location;
            return (
                <div className="flex items-center gap-1.5 text-slate-600">
                    {isVirtual ? (
                        <LinkIcon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    ) : (
                        <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    )}
                    <span className="text-sm truncate max-w-[180px]">
                        {ev.location || ev.meeting_url || "Por definir"}
                    </span>
                </div>
            );
        },
    },
    {
        id: "status",
        header: "Estatus",
        accessorFn: (row) => {
            const ev = row as OrgEvent; 
            const isPast = new Date(ev.starts_at) < new Date();
            return !ev.is_active ? "Inactivo" : isPast ? "Finalizado" : "Próximo";
        },
        cell: ({ row }) => {
            const ev = row.original as OrgEvent;
            const isPast = new Date(ev.starts_at) < new Date();
            const isActive = ev.is_active;

            let badgeStyle = "bg-slate-100 text-slate-500";
            let label = "Inactivo";

            if (isActive) {
                if (isPast) {
                    badgeStyle = "bg-slate-100 text-slate-600";
                    label = "Finalizado";
                } else {
                    badgeStyle = "bg-emerald-100 text-emerald-800";
                    label = "Próximo";
                }
            }

            return <Badge className={`${badgeStyle} border-none shadow-none`}>{label}</Badge>;
        },
    },
    {
        accessorKey: "registrations_count",
        header: "Registrados",
        cell: ({ row }) => {
            const count = row.original.registrations_count || 0;
            return (
                <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-bold text-blue-700">{count}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "attended_count",
        header: "Asistieron",
        cell: ({ row }) => {
            const count = row.original.attended_count || 0;
            return (
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700">{count}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "unattended_count",
        header: "No Asistieron",
        cell: ({ row }) => {
            const count = row.original.unattended_count || 0;
            return (
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-sm font-semibold text-slate-600">{count}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Acciones</div>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-end pr-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                        onClick={() => onView(row.original)}
                        title="Ver detalles del evento"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <DataTableRowActions
                        row={row}
                        onEdit={() => onEdit(row.original)}
                        onDelete={() => onDelete(row.original.uid)}
                    />
                </div>
            );
        },
    },
];