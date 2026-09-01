"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Calendar as CalendarIcon,
    ShieldCheck,
    Save,
    Mail,
    Phone,
    Check,
    Copy,
    UserCheck,
    DollarSign,
    Trash2,
    MapPin,
    Shield
} from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { InsuranceApplication, UpdateInsuranceDto } from "@/services/insurance/org-insurance.service";

interface InsuranceAdminSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    application: InsuranceApplication | null;
    onUpdate: (uid: string, data: UpdateInsuranceDto) => Promise<void>;
    onDelete: (uid: string) => Promise<void>;
}

export function InsuranceAdminSheet({
    open,
    onOpenChange,
    application,
    onUpdate,
    onDelete,
}: InsuranceAdminSheetProps) {
    type AppStatus = "Open" | "Lost" | "Won" | "Abandon";
    type CommissionStatus = "pending" | "paid" | "not_applicable";

    const [status, setStatus] = useState<AppStatus>("Open");
    const [commissionAmount, setCommissionAmount] = useState(0);
    const [commissionStatus, setCommissionStatus] = useState<CommissionStatus>("not_applicable");
    const [payoutDate, setPayoutDate] = useState<Date | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open && application) {
            setStatus(application.status as AppStatus);
            setCommissionAmount(Number(application.commission_amount) || 0);
            setCommissionStatus((application.commission_status as CommissionStatus) || "not_applicable");

            if (application.seller_payout_date) {
                // Aseguramos que tome bien la fecha ignorando la zona horaria al cortar el string
                setPayoutDate(new Date(application.seller_payout_date.split("T")[0] + "T12:00:00"));
            } else {
                setPayoutDate(undefined);
            }
        }
    }, [open, application]);

    if (!application) return null;

    const handleCommissionStatusChange = (newVal: CommissionStatus) => {
        setCommissionStatus(newVal);
        if (newVal === "paid" && !payoutDate) {
            setPayoutDate(new Date());
        }
    };

    const handleConfirmChanges = async () => {
        setIsSaving(true);
        try {
            await onUpdate(application.uid, {
                status: status,
                commission_amount: commissionAmount,
                commission_status: commissionStatus,
                seller_payout_date: payoutDate ? format(payoutDate, "yyyy-MM-dd") : (null as any),
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const commStatusStyles: Record<CommissionStatus | "default", string> = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        paid: "bg-green-100 text-green-700 border-green-200",
        not_applicable: "bg-slate-100 text-slate-700 border-slate-200",
        default: "bg-white border-slate-200 text-slate-900",
    };

    const CopyButton = ({ text }: { text: string }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
        return (
            <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors" title="Copiar">
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
        );
    };

    const displayName = application.customer
        ? `${application.customer.first_name} ${application.customer.last_name}`.trim()
        : application.applicant_name;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md overflow-y-auto p-0 flex flex-col bg-white border-l shadow-2xl">
                <SheetHeader className="space-y-1 border-b p-6 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] px-2 py-0 uppercase">
                            Seguros
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-mono tracking-tighter">
                            REF_{application.uid.split('-')[0].toUpperCase()}
                        </span>
                    </div>
                    <SheetTitle className="text-xl flex items-center justify-between">
                        <span>Gestión de Solicitud</span>
                        <Button
                            variant="outline"
                            onClick={async () => {
                                if (window.confirm("¿Estás seguro de eliminar esta solicitud de seguro? Esta acción es irreversible.")) {
                                    await onDelete(application.uid);
                                    onOpenChange(false);
                                }
                            }}
                            disabled={isSaving}
                            className="border-0 hover:bg-red-50"
                            title="Eliminar registro"
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </SheetTitle>
                    <SheetDescription className="text-slate-500 text-xs font-medium">
                        Registrado el {new Date(application.created_at).toLocaleDateString()}
                    </SheetDescription>
                </SheetHeader>

                <div className="p-4 space-y-6 flex-1 bg-white">
                    {/* INFO CLIENTE */}
                    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14 border-2 border-white shadow-lg ring-1 ring-slate-100">
                                <AvatarFallback className="bg-slate-900 text-white text-lg font-bold">
                                    {displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                                <h4 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                                    {displayName}
                                </h4>

                                {/* Email Row */}
                                <div className="flex items-center gap-2 group">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="truncate max-w-[180px]">
                                            {application.customer?.email || application.applicant_email || "Sin correo"}
                                        </span>
                                    </div>
                                    {(application.customer?.email || application.applicant_email) && (
                                        <CopyButton text={application.customer?.email || application.applicant_email} />
                                    )}
                                </div>

                                {/* Phone Row */}
                                <div className="flex items-center gap-2 group">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{application.customer?.phone || application.applicant_phone || "Sin teléfono"}</span>
                                    </div>
                                    {(application.customer?.phone || application.applicant_phone) && (
                                        <CopyButton text={application.customer?.phone || application.applicant_phone} />
                                    )}
                                </div>

                                {/* Address Row */}
                                {application.applicant_address && (
                                    <div className="flex items-start gap-1.5 text-slate-500 text-xs mt-1">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                                        <span className="line-clamp-2">{application.applicant_address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {application.user && (
                            <div className="mt-2 pt-3 border-t border-dashed border-slate-200">
                                <div className="flex items-center justify-between bg-slate-50/80 rounded-lg p-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1.5 rounded-full shadow-sm">
                                            <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                                                Referido por
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold text-slate-700">
                                                    {application.user.name}
                                                </p>
                                            </div>
                                            <p className="text-[10px] text-slate-400 italic">
                                                {application.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Separator className="bg-slate-100" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 block uppercase tracking-wider">
                                    Tipo de Póliza
                                </p>
                                <p className="font-bold text-slate-700 text-xs leading-tight capitalize flex items-center">
                                    <Shield className="h-3 w-3 inline mr-1 text-indigo-500" />
                                    {application.insurance_type || "Seguro General"}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs font-medium text-slate-500 block uppercase tracking-wider">
                                    Estatus Trámite
                                </p>
                                <Select value={status} onValueChange={(val) => setStatus(val as AppStatus)}>
                                    <SelectTrigger className="h-7 text-xs font-semibold border-slate-200 shadow-sm mt-1">
                                        <SelectValue placeholder="Estatus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="Won">Won</SelectItem>
                                        <SelectItem value="Lost">Lost</SelectItem>
                                        <SelectItem value="Abandon">Abandon</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    {/* TARJETA DE COMISIÓN (ESTILO CALCULADORA PERO FIJA) */}
                    <section className="space-y-4">
                        <div
                            className={cn(
                                "rounded-xl p-6 text-white relative overflow-hidden transition-all duration-500",
                                commissionStatus === "paid"
                                    ? "bg-emerald-600 shadow-emerald-900/20"
                                    : commissionStatus === "not_applicable"
                                        ? "bg-slate-400 shadow-slate-900/10"
                                        : "bg-amber-400 shadow-amber-900/20"
                            )}
                        >
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="uppercase font-bold text-sm tracking-wider opacity-90">
                                        Comisión del Agente
                                    </span>
                                    <div className="flex bg-black/10 p-1 rounded-lg backdrop-blur-sm">
                                        <button className="px-3 py-1 text-xs font-bold rounded-md bg-white text-black shadow-sm flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" /> Monto Fijo
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/20 pt-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-semibold opacity-80 uppercase tracking-widest block">
                                            Asignar Monto
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-2xl font-bold opacity-80">$</span>
                                            <input
                                                type="number"
                                                value={commissionAmount}
                                                onChange={(e) => setCommissionAmount(parseFloat(e.target.value) || 0)}
                                                className="bg-white/20 border-transparent text-white placeholder-white/50 text-3xl font-bold w-32 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all tabular-nums rounded px-2 py-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <ShieldCheck className="h-10 w-10 opacity-20 inline-block mb-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SELECTOR DE STATUS Y FECHA DE PAGO */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-bold uppercase">
                                    Estado de pago:
                                </span>
                                <Select value={commissionStatus} onValueChange={handleCommissionStatusChange}>
                                    <SelectTrigger
                                        className={`h-9 text-xs font-medium border rounded-md transition-colors ${commStatusStyles[commissionStatus] || commStatusStyles.default}`}
                                    >
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="pending">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-amber-500" /> Pendiente
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="paid">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-green-500" /> Pagada
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="not_applicable">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-slate-400" /> No Aplica
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator className="bg-slate-200/50" />

                            <div className="space-y-2">
                                <span className="text-xs block ml-1">Fecha Programada / Pagada</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-bold h-11 border-slate-200 bg-white",
                                                !payoutDate && "text-slate-400"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                                            {payoutDate ? format(payoutDate, "PPP", { locale: es }) : "Asignar fecha"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={payoutDate}
                                            onSelect={setPayoutDate}
                                            locale={es}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </section>
                </div>

                <SheetFooter className="p-4 border-t bg-slate-50">
                    <Button onClick={handleConfirmChanges} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                        {isSaving ? "Guardando..." : <><Save className="mr-2 h-4 w-4" /> Confirmar Cambios</>}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto mt-2 sm:mt-0">
                            Descartar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}