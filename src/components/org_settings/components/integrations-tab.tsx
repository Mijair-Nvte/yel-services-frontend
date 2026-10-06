"use client";

import React, { useEffect, useState } from 'react';
import { useCompanySettings } from '@/hooks/org_company_settings/useCompanySettings';
import { apiFetch } from '@/services/http';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Webhook, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import MetaSettingsTab from './meta-tab'; // Importamos el componente separado

interface CrmIntegrationSettings {
  initial_sync_completed: boolean;
  meta?: any;
}

const defaultIntegrationSettings: CrmIntegrationSettings = {
  initial_sync_completed: false,
};

interface IntegrationsTabProps {
  workspaceUid: string;
}

export default function IntegrationsTab({ workspaceUid }: IntegrationsTabProps) {
  const {
    settings,
    setSettings,
    isLoading,
    error,
  } = useCompanySettings<CrmIntegrationSettings>(workspaceUid, 'crm_integrations', defaultIntegrationSettings);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const metaStatus = searchParams.get('meta_status');

  useEffect(() => {
    if (metaStatus === 'success') {
      alert("¡Cuenta de Meta conectada exitosamente!");
      window.history.replaceState(null, '', window.location.pathname);
    } else if (metaStatus === 'error') {
      alert("Hubo un error al conectar con Meta.");
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [metaStatus]);

  const handleStartSync = async () => {
    if (!workspaceUid) return;
    if (!window.confirm("¿Estás seguro de iniciar la importación masiva de contactos?")) return;

    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const response = await apiFetch(`/org-companies/${workspaceUid}/ghl/sync-historical`, {
        method: 'POST',
      });
      setSyncMessage(response.message || "Sincronización iniciada.");
      setSettings({ ...settings, initial_sync_completed: true });
    } catch (err: any) {
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
          Integraciones CRM y Analítica
        </CardTitle>
        <CardDescription>
          Conecta y sincroniza los datos de tu empresa con plataformas externas como GoHighLevel y Meta.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        
        {/* Sección GoHighLevel */}
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
                  Importa todos los contactos existentes desde GoHighLevel hacia tu base de datos local.
                </p>
                {syncMessage && (
                  <p className="text-xs text-primary font-medium mt-2">{syncMessage}</p>
                )}
              </div>

              <div className="shrink-0">
                {settings.initial_sync_completed ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 px-4 py-2 rounded-full font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Sincronización Completada
                  </div>
                ) : (
                  <Button onClick={handleStartSync} disabled={isSyncing} className="gap-2 w-full sm:w-auto">
                    {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Importar Contactos
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Componente separado de Meta */}
        <MetaSettingsTab 
          workspaceUid={workspaceUid} 
          settings={settings} 
          setSettings={setSettings} 
        />

      </CardContent>
    </Card>
  );
}