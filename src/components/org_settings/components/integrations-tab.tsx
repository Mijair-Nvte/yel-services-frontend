"use client";

import React, { useState } from 'react';
import { useCompanySettings } from '@/hooks/org_company_settings/useCompanySettings';
import { apiFetch } from '@/services/http';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Webhook, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CrmIntegrationSettings {
  initial_sync_completed: boolean;
}

const defaultIntegrationSettings: CrmIntegrationSettings = {
  initial_sync_completed: false,
};

interface IntegrationsTabProps {
  workspaceUid: string;
}

export default function IntegrationsTab({ workspaceUid }: IntegrationsTabProps) {
  // Usamos tu hook mágico para leer/guardar el status de la BD
  const {
    settings,
    setSettings,
    isLoading,
    error,
  } = useCompanySettings<CrmIntegrationSettings>(workspaceUid, 'crm_integrations', defaultIntegrationSettings);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleStartSync = async () => {
    if (!workspaceUid) return;
    
    // Confirmación para no dispararlo por accidente
    if (!window.confirm("¿Estás seguro de iniciar la importación masiva de contactos? Este proceso corre en segundo plano y puede tardar varios minutos dependiendo del volumen de datos.")) {
        return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    try {
      // Hacemos el POST a la nueva ruta protegida
      const response = await apiFetch(`/org-companies/${workspaceUid}/ghl/sync-historical`, {
        method: 'POST',
      });

      setSyncMessage(response.message || "Sincronización iniciada.");
      
      // Actualizamos el estado local para que la UI cambie automáticamente
      setSettings({
        ...settings,
        initial_sync_completed: true,
      });

    } catch (err: any) {
      console.error("Error al iniciar sync:", err);
      setSyncMessage(err?.message || "Ocurrió un error al intentar iniciar la sincronización.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Cargando configuración de integraciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-destructive bg-destructive/10 rounded-lg border border-destructive/20 text-sm">
        {error}
      </div>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          Integraciones CRM
        </CardTitle>
        <CardDescription>
          Conecta y sincroniza los datos de tu empresa con plataformas externas como GoHighLevel.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Webhook className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base">GoHighLevel (GHL)</h3>
          </div>
          
          <div className="pl-6 grid gap-4">
            <div className="rounded-lg border p-4 bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Sincronización Histórica de Contactos</h4>
                <p className="text-sm text-muted-foreground">
                  Importa todos los contactos existentes desde GoHighLevel hacia tu base de datos local. Solo se permite ejecutar una vez por empresa.
                </p>
                {syncMessage && (
                  <p className="text-xs text-primary font-medium mt-2 animate-in fade-in">
                    {syncMessage}
                  </p>
                )}
              </div>
              
              <div className="shrink-0">
                {settings.initial_sync_completed ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 px-4 py-2 rounded-full font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Sincronización Completada
                  </div>
                ) : (
                  <Button 
                    onClick={handleStartSync} 
                    disabled={isSyncing}
                    className="gap-2 w-full sm:w-auto"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Importar Contactos
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />
      </CardContent>
    </Card>
  );
}