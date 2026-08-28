"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Shield, Users, Building, Briefcase, HandCoins } from "lucide-react";

// Importamos los componentes de las pestañas (los crearemos en el siguiente paso)
import TeamSettingsTab from "@/components/org_settings/components/team-tab";
import InsuranceSettingsTab from "@/components/org_settings/components/insurance-tab";
import LoansSettingsTab from "@/components/org_settings/components/loans-tab";

export default function SettingsPage() {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Settings2 className="w-6 h-6" />
            Configuración de la Compañía
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los accesos, configuraciones de seguros, préstamos y más.
          </p>
        </div>
      </div>

      {/* TABS DE SHADCN */}
      <Tabs defaultValue="team" className="w-full">
        {/* Scroll horizontal en móviles para que no se rompa el diseño */}
        <div className="overflow-x-auto pb-6">
          <TabsList className="inline-flex h-12 items-center justify-center p-1 text-muted-foreground  border border-border/50">

            <TabsTrigger
              value="team"
              className="gap-2  px-4 py-2.5 text-sm font-medium transition-all hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border"
            >
              <Users className="w-4 h-4" />
              Equipo
            </TabsTrigger>

            <TabsTrigger
              value="insurance"
              className="gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border"
            >
              <Shield className="w-4 h-4" />
              Seguros
            </TabsTrigger>

            <TabsTrigger
              value="loans"
              className="gap-2  px-4 py-2.5 text-sm font-medium transition-all hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border"
            >
              <HandCoins className="w-4 h-4" />
              Préstamos
            </TabsTrigger>

            {/* Pestañas deshabilitadas */}
            <TabsTrigger
              value="properties"
              disabled
              className="gap-2  px-4 py-2.5 text-sm font-medium opacity-50 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Building className="w-4 h-4" />
              Propiedades
            </TabsTrigger>

            <TabsTrigger
              value="sales"
              disabled
              className="gap-2 rounded-lg px-4 py-2.5 text-sm font-medium opacity-50 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Briefcase className="w-4 h-4" />
              Ventas
            </TabsTrigger>

          </TabsList>
        </div>

        {/* CONTENIDO DE CADA PESTAÑA */}
        <div className="mt-4">
          <TabsContent value="team" className="m-0">
            <TeamSettingsTab workspaceUid={workspaceUid} />
          </TabsContent>

          <TabsContent value="insurance" className="m-0">
            <InsuranceSettingsTab workspaceUid={workspaceUid} />
          </TabsContent>

          <TabsContent value="loans" className="m-0">
            <LoansSettingsTab workspaceUid={workspaceUid} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}