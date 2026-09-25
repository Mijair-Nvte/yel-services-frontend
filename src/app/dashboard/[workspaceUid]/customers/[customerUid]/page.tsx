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
  Edit,
  MapPin,
  MoreVertical,
  CheckCircle2,
  ExternalLink,
  UserCheck
} from "lucide-react";
import { OrgCustomerService, OrgCustomer } from "@/services/org-customer/org-customer.service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Importamos los componentes de las pestañas
import { CustomerLoansTab } from "@/components/org_customers/tabs/customer-loans-tab";
import { CustomerInsuranceTab } from "@/components/org_customers/tabs/customer-insurance-tab";
import { CustomerEventsTab } from "@/components/org_customers/tabs/customer-events-tab";
import { CustomerServiceOrdersTab } from "@/components/org_customers/tabs/customer-service-orders-tab";

export default function CustomerDetailsPage() {
  const { workspaceUid, customerUid } = useParams() as { workspaceUid: string; customerUid: string };
  const router = useRouter();

  const [customer, setCustomer] = useState<OrgCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
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
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-slate-400 text-sm font-medium">Cargando perfil del cliente...</p>
      </div>
    );
  }

  if (!customer) return null;

  const fullName = `${customer.first_name} ${customer.last_name || ""}`.trim();
  const initials = `${customer.first_name?.charAt(0) || ""}${customer.last_name?.charAt(0) || ""}`.toUpperCase();

  // 🚀 LÓGICA PARA EL ENLACE AL CRM (GoHighLevel)
  const locationId = process.env.NEXT_PUBLIC_GHL_LOCATION_ID;
  const ghlUrl = customer.contact_id && locationId
    ? `https://app.ideashubai.com/v2/location/${locationId}/contacts/detail/${customer.contact_id}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-2 md:p-6 lg:p-8 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 🚀 HEADER DEL PERFIL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 bg-white shadow-sm hover:bg-slate-50" 
              onClick={() => router.push(`/dashboard/${workspaceUid}/customers`)}
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Perfil del Cliente
            </h1>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium px-2 py-0.5">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Activo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white shadow-sm text-slate-700">
              <Edit className="h-4 w-4 mr-2" /> Editar Perfil
            </Button>
            <Button variant="outline" size="icon" className="bg-white shadow-sm text-slate-700">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 🧩 LAYOUT PRINCIPAL (2 COLUMNAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: TARJETAS DE INFORMACIÓN (Fijas) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tarjeta 1: Perfil de Usuario */}
            <Card className="border-slate-200/60 pt-0 shadow-sm overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <CardContent className="px-6 pb-6 pt-0 relative">
                <div className="flex justify-center -mt-10 mb-4">
                  <div className="h-20 w-20 rounded-full bg-white p-1 shadow-md">
                    <div className="h-full w-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                      {initials}
                    </div>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
                  <p className="text-sm text-slate-500 font-medium">Cliente Directo</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">Email</p>
                      <p className="text-sm font-medium text-slate-900 break-all">{customer.email || "No registrado"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">Teléfono</p>
                      <p className="text-sm font-medium text-slate-900">{customer.phone || "No registrado"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">Ubicación</p>
                      <p className="text-sm font-medium text-slate-900">No especificada</p>
                    </div>
                  </div>
                </div>

                {/* 🚀 BOTÓN DE ACCESO AL CRM */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  {ghlUrl ? (
                    <Button
                      variant="outline"
                      className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-colors"
                      onClick={() => window.open(ghlUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir en CRM (GoHighLevel)
                    </Button>
                  ) : (
                    <Button variant="ghost" disabled className="w-full text-slate-400 bg-slate-50">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Contacto Local (Sin CRM)
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Tarjeta 2: Información General */}
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  Detalles Operativos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Origen de Registro</p>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700">
                    {customer.metadata?.source || "Captura Manual / Directo"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Fecha de Registro</p>
                  <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(customer.created_at).toLocaleDateString("es-MX", {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-2">Etiquetas / Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.metadata?.tags?.length ? (
                      customer.metadata.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 font-normal">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">Sin etiquetas asignadas</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* COLUMNA DERECHA: PESTAÑAS Y CONTENIDO (Dinámico) */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="loans" className="w-full">
              {/* Navegación Estilo "Pills" moderno */}
              <div className="bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-sm mb-6 overflow-x-auto">
                <TabsList className="flex w-max min-w-full justify-start h-auto bg-transparent p-0 space-x-1">
                  <TabsTrigger 
                    value="loans" 
                    className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium text-slate-600 transition-all"
                  >
                    <FileText className="h-4 w-4" /> Préstamos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sales" 
                    className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium text-slate-600 transition-all"
                  >
                    <Briefcase className="h-4 w-4" /> Órdenes y Servicios
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insurance" 
                    className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium text-slate-600 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" /> Pólizas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="events" 
                    className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none font-medium text-slate-600 transition-all"
                  >
                    <Ticket className="h-4 w-4" /> Eventos
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* CONTENEDORES DE LAS PESTAÑAS */}
              <TabsContent value="loans" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <CustomerLoansTab workspaceUid={workspaceUid} customerUid={customerUid} customerName={customer.first_name} />
              </TabsContent>

              <TabsContent value="sales" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <CustomerServiceOrdersTab workspaceUid={workspaceUid} customerUid={customerUid} customerName={customer.first_name} />
              </TabsContent>

              <TabsContent value="insurance" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <CustomerInsuranceTab workspaceUid={workspaceUid} customerUid={customerUid} customerName={customer.first_name} />
              </TabsContent>

              <TabsContent value="events" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <CustomerEventsTab workspaceUid={workspaceUid} customerUid={customerUid} customerName={customer.first_name} />
              </TabsContent>
            </Tabs>
          </div>
          
        </div>
      </div>
    </div>
  );
}