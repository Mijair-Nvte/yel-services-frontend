"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Ticket,
  Loader2,
  Edit
} from "lucide-react";
import { OrgCustomerService, OrgCustomer } from "@/services/org-customer/org-customer.service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CustomerDetailsPage() {
  const { workspaceUid, customerUid } = useParams() as { workspaceUid: string; customerUid: string };
  const router = useRouter();
  
  const [customer, setCustomer] = useState<OrgCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        // Aprovechamos el método getOne que ya creamos en tu servicio
        const data = await OrgCustomerService.getOne(workspaceUid, customerUid);
        setCustomer(data);
      } catch (error) {
        toast.error("Error al cargar los detalles del cliente.");
        router.push(`/dashboard/${workspaceUid}/customers`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [workspaceUid, customerUid, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-slate-400 text-sm">Cargando perfil del cliente...</p>
      </div>
    );
  }

  if (!customer) return null;

  const fullName = `${customer.first_name} ${customer.last_name || ""}`.trim();

  return (
    <div className="space-y-6 p-1 max-w-7xl mx-auto w-full">
      {/* 🚀 HEADER DEL PERFIL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => router.push(`/dashboard/${workspaceUid}/customers`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mt-1.5">
              {customer.email && (
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-slate-400" /> {customer.email}</span>
              )}
              {customer.phone && (
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> {customer.phone}</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <Button variant="secondary">
            <Edit className="h-4 w-4 mr-2" /> Editar Perfil
          </Button>
        </div>
      </div>

      {/* 🧩 SISTEMA DE PESTAÑAS (TABS) */}
      <Tabs defaultValue="overview" className="w-full">
        {/* Usamos scroll automático en móviles si hay muchas pestañas */}
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex w-max min-w-full md:grid md:grid-cols-5 h-auto p-1 bg-slate-100/80 dark:bg-slate-800/50">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-2.5 data-[state=active]:shadow-sm">
              <User className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center gap-2 py-2.5 data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" /> Préstamos
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2 py-2.5 data-[state=active]:shadow-sm">
              <Briefcase className="h-4 w-4" /> Ventas
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2 py-2.5 data-[state=active]:shadow-sm">
              <ShieldCheck className="h-4 w-4" /> Seguros
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2 py-2.5 data-[state=active]:shadow-sm">
              <Ticket className="h-4 w-4" /> Eventos
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: INFORMACIÓN GENERAL */}
        <TabsContent value="overview" className="mt-4">
           <Card className="shadow-sm border-slate-200/60">
             <CardHeader>
               <CardTitle>Información General</CardTitle>
               <CardDescription>Detalles principales y segmentación de este contacto.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-900/20 p-4 rounded-lg border border-slate-100">
                   <div>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Origen (Source)</p>
                     <p className="text-sm font-medium text-slate-900">{customer.metadata?.source || "Captura Manual / Directo"}</p>
                   </div>
                   <div>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Etiquetas</p>
                     <div className="flex flex-wrap gap-1">
                        {customer.metadata?.tags?.length ? (
                          customer.metadata.tags.map((tag: string, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-white">{tag}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400 italic">Sin etiquetas asignadas</span>
                        )}
                     </div>
                   </div>
                   <div>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Fecha de Registro</p>
                     <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        {new Date(customer.created_at).toLocaleDateString("es-MX", { 
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}
                     </p>
                   </div>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* TAB 2: PRÉSTAMOS (Placeholder para la tabla de Préstamos) */}
        <TabsContent value="loans" className="mt-4">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle>Historial de Préstamos</CardTitle>
              <CardDescription>Solicitudes de financiamiento asociadas a {customer.first_name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <FileText className="h-10 w-10 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No hay préstamos recientes</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">
                  Aquí se integrará la tabla de tu componente `LoanTable` filtrada para este usuario.
                </p>
                <Button variant="outline">Asignar Préstamo</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: VENTAS Y SERVICIOS */}
        <TabsContent value="sales" className="mt-4">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle>Servicios Adquiridos</CardTitle>
              <CardDescription>Ventas y servicios en los que este cliente participa.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <Briefcase className="h-10 w-10 text-slate-300 mb-4" />
                <p className="text-sm text-slate-500">Aquí integraremos la tabla de ventas ligadas a este UID.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: SEGUROS */}
        <TabsContent value="insurance" className="mt-4">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle>Pólizas de Seguro</CardTitle>
              <CardDescription>Seguros contratados o en proceso (Cotización).</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <ShieldCheck className="h-10 w-10 text-slate-300 mb-4" />
                <p className="text-sm text-slate-500">Aquí integraremos la tabla de seguros (Insurance Applications).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: EVENTOS */}
        <TabsContent value="events" className="mt-4">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle>Eventos Registrados</CardTitle>
              <CardDescription>Historial de asistencia y registros a eventos de YEL.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <Ticket className="h-10 w-10 text-slate-300 mb-4" />
                <p className="text-sm text-slate-500">Aquí integraremos el historial de Event Catalog Registrations.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}