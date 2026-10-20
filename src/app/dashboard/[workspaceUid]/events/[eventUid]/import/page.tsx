"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Papa from "papaparse";
import { toast } from "sonner";
import { ArrowLeft, UploadCloud, CheckCircle2, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrgEventService } from "@/services/events/org-event.service";

export default function ImportRegistrationsPage() {
    const { workspaceUid, eventUid } = useParams() as { workspaceUid: string; eventUid: string };
    const router = useRouter();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [file, setFile] = useState<File | null>(null);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mapeo: Llaves del sistema -> Nombre de la columna en el CSV
    const [mapping, setMapping] = useState({
        name: "",
        email: "",
        phone: "",
        source: "",
        attended: "", // 👈 Agregamos asistencia al estado
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
            toast.error("Por favor, sube un archivo con formato .csv");
            return;
        }

        setFile(selectedFile);

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.meta.fields && results.meta.fields.length > 0) {
                    setCsvHeaders(results.meta.fields);
                    setCsvData(results.data);
                    
                    // Auto-mapeo simple
                    const autoMap = { name: "", email: "", phone: "", source: "", attended: "" };
                    results.meta.fields.forEach(field => {
                        const lower = field.toLowerCase();
                        if (!autoMap.name && (lower.includes("nombre") || lower.includes("name"))) autoMap.name = field;
                        if (!autoMap.email && (lower.includes("correo") || lower.includes("email"))) autoMap.email = field;
                        if (!autoMap.phone && (lower.includes("telefono") || lower.includes("tel") || lower.includes("phone"))) autoMap.phone = field;
                        if (!autoMap.source && (lower.includes("origen") || lower.includes("source") || lower.includes("campaña"))) autoMap.source = field;
                        if (!autoMap.attended && (lower.includes("asistencia") || lower.includes("asistio") || lower.includes("attended"))) autoMap.attended = field;
                    });
                    
                    setMapping(autoMap);
                    setStep(2);
                } else {
                    toast.error("No se encontraron columnas en el archivo CSV.");
                }
            },
            error: () => {
                toast.error("Error al procesar el archivo CSV.");
            }
        });
    };

    const handleImport = async () => {
        if (!mapping.name && !mapping.email) {
            toast.error("Debes mapear al menos el Nombre o el Correo electrónico.");
            return;
        }

        setIsSubmitting(true);
        setStep(3);

        // Procesar los datos crudos enviando también la columna "attended"
        const contactsPayload = csvData.map(row => ({
            name: mapping.name ? row[mapping.name] : "",
            email: mapping.email ? row[mapping.email] : "",
            phone: mapping.phone ? row[mapping.phone] : "",
            source: mapping.source ? row[mapping.source] : "Importación CSV",
            attended: mapping.attended ? row[mapping.attended] : false, // 👈 Se envía de forma interna al Backend
        }));

        try {
            const response = await OrgEventService.importRegistrations(workspaceUid, eventUid, contactsPayload);
            toast.success(response.message || "Importación exitosa");
            router.push(`/dashboard/${workspaceUid}/events/${eventUid}`);
        } catch (error: any) {
            toast.error(error.message || "Error al importar los contactos.");
            setStep(2);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tomamos la primera fila como muestra para el Preview
    const sampleRow = csvData.length > 0 ? csvData[0] : null;

    // Helper para dibujar el preview
    const renderPreview = (selectedColumn: string) => {
        if (!selectedColumn || selectedColumn === "ignore" || !sampleRow) return null;
        
        const value = sampleRow[selectedColumn];
        const displayValue = (value !== null && value !== undefined && value !== "") ? String(value) : "(Vacío)";

        return (
            <div className="mt-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 max-w-full">
                <span className="truncate">Ejemplo Fila 1: <strong>{displayValue}</strong></span>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-6">
            <Button
                variant="ghost"
                className="text-slate-500 hover:text-slate-800 -ml-2"
                onClick={() => router.push(`/dashboard/${workspaceUid}/events/${eventUid}`)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Volver al evento
            </Button>

            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Importar Asistentes</h1>
                <p className="text-slate-500 mt-2">
                    Sube un archivo CSV para registrar o relacionar clientes masivamente a este evento.
                </p>
            </div>

            {/* STEP 1: UPLOAD */}
            {step === 1 && (
                <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-400 transition-colors">
                    <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-2">
                        <UploadCloud className="h-10 w-10" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-slate-800">Selecciona tu archivo CSV</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                            Asegúrate de que la primera fila contenga los nombres de las columnas (ej. Nombre, Correo, Teléfono).
                        </p>
                    </div>
                    
                    <div className="relative mt-4">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                            Buscar archivo
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 2: MAPPING */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-semibold text-emerald-800">Archivo cargado correctamente</h3>
                            <p className="text-xs text-emerald-600 mt-1">
                                <strong>{file?.name}</strong> con {csvData.length} registros detectados. Ahora relaciona tus columnas con los campos del sistema.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 p-4">
                            <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Campo del Sistema</div>
                            <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Columna en tu CSV (con vista previa)</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            
                            {/* Fila Mapeo: Nombre */}
                            <div className="grid grid-cols-2 items-start p-4 gap-4">
                                <div>
                                    <p className="font-semibold text-slate-800">Nombre Completo <span className="text-red-500">*</span></p>
                                    <p className="text-xs text-slate-500 mt-1">El nombre principal del asistente.</p>
                                </div>
                                <div className="min-w-0">
                                    <Select value={mapping.name} onValueChange={(val) => setMapping(prev => ({...prev, name: val === "ignore" ? "" : val}))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar columna..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ignore" className="text-slate-400 italic">-- Ignorar este campo --</SelectItem>
                                            {csvHeaders.map(header => (
                                                <SelectItem key={header} value={header}>{header}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderPreview(mapping.name)}
                                </div>
                            </div>

                            {/* Fila Mapeo: Correo */}
                            <div className="grid grid-cols-2 items-start p-4 gap-4">
                                <div>
                                    <p className="font-semibold text-slate-800">Correo Electrónico</p>
                                    <p className="text-xs text-slate-500 mt-1">Usado para notificaciones y vinculación exacta.</p>
                                </div>
                                <div className="min-w-0">
                                    <Select value={mapping.email} onValueChange={(val) => setMapping(prev => ({...prev, email: val === "ignore" ? "" : val}))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar columna..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ignore" className="text-slate-400 italic">-- Ignorar este campo --</SelectItem>
                                            {csvHeaders.map(header => (
                                                <SelectItem key={header} value={header}>{header}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderPreview(mapping.email)}
                                </div>
                            </div>

                            {/* Fila Mapeo: Teléfono */}
                            <div className="grid grid-cols-2 items-start p-4 gap-4">
                                <div>
                                    <p className="font-semibold text-slate-800">Teléfono / WhatsApp</p>
                                </div>
                                <div className="min-w-0">
                                    <Select value={mapping.phone} onValueChange={(val) => setMapping(prev => ({...prev, phone: val === "ignore" ? "" : val}))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar columna..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ignore" className="text-slate-400 italic">-- Ignorar este campo --</SelectItem>
                                            {csvHeaders.map(header => (
                                                <SelectItem key={header} value={header}>{header}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderPreview(mapping.phone)}
                                </div>
                            </div>

                            {/* Fila Mapeo: Origen */}
                            <div className="grid grid-cols-2 items-start p-4 gap-4">
                                <div>
                                    <p className="font-semibold text-slate-800">Origen de Campaña (Source)</p>
                                    <p className="text-xs text-slate-500 mt-1">Ej: Facebook, Base de datos VIP, Orgánico.</p>
                                </div>
                                <div className="min-w-0">
                                    <Select value={mapping.source} onValueChange={(val) => setMapping(prev => ({...prev, source: val === "ignore" ? "" : val}))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar columna..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ignore" className="text-slate-400 italic">-- Ignorar este campo --</SelectItem>
                                            {csvHeaders.map(header => (
                                                <SelectItem key={header} value={header}>{header}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderPreview(mapping.source)}
                                </div>
                            </div>

                            {/* Fila Mapeo: Asistencia */}
                            <div className="grid grid-cols-2 items-start p-4 gap-4 bg-indigo-50/30">
                                <div>
                                    <p className="font-semibold text-slate-800">¿Asistió a la clase?</p>
                                    <p className="text-xs text-slate-500 mt-1">Valores esperados en CSV: Sí, TRUE, 1, Checked.</p>
                                </div>
                                <div className="min-w-0">
                                    <Select value={mapping.attended} onValueChange={(val) => setMapping(prev => ({...prev, attended: val === "ignore" ? "" : val}))}>
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Seleccionar columna (Opcional)..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ignore" className="text-slate-400 italic">-- Ninguna (Será Pendiente/Falso) --</SelectItem>
                                            {csvHeaders.map(header => (
                                                <SelectItem key={header} value={header}>{header}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderPreview(mapping.attended)}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            Cambiar archivo
                        </Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-700" 
                            onClick={handleImport}
                            disabled={!mapping.name && !mapping.email}
                        >
                            <Link2 className="h-4 w-4 mr-2" />
                            Comenzar Importación
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 3: SUBMITTING */}
            {step === 3 && (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Procesando contactos...</h3>
                        <p className="text-slate-500 mt-2">
                            Esto puede tomar unos segundos dependiendo de la cantidad de registros en tu archivo.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}