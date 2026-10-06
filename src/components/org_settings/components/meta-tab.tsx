"use client";

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/services/http';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Facebook, Layers } from 'lucide-react';

interface MetaTabProps {
  workspaceUid: string;
  settings: any;
  setSettings: (newSettings: any) => void;
}

export default function MetaSettingsTab({ workspaceUid, settings, setSettings }: MetaTabProps) {
  const [isConnectingFb, setIsConnectingFb] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  useEffect(() => {
    if (settings.meta?.access_token && workspaceUid) {
      fetchMetaPages();
      if (settings.meta.selected_page_id) {
        setSelectedPageId(settings.meta.selected_page_id);
      }
    }
  }, [settings.meta?.access_token, workspaceUid]);

  const fetchMetaPages = async () => {
    setLoadingPages(true);
    try {
      const response = await apiFetch(`/org-companies/${workspaceUid}/integrations/meta/pages`, {
        method: 'GET',
      });
      if (response && response.pages) {
        setPages(response.pages);
      }
    } catch (err) {
      console.error("Error al cargar páginas de Meta:", err);
    } finally {
      setLoadingPages(false);
    }
  };

  const handleSaveSelectedPage = async () => {
    const pageObj = pages.find(p => p.id === selectedPageId);
    if (!pageObj) return;

    const updatedMeta = {
      ...settings.meta,
      selected_page_id: pageObj.id,
      selected_page_name: pageObj.name,
      page_access_token: pageObj.access_token,
    };

    setSettings({
      ...settings,
      meta: updatedMeta,
    });

    try {
      await apiFetch(`/org-companies/${workspaceUid}/modules/crm_integrations/settings`, {
        method: 'PUT',
        body: JSON.stringify({
          settings: { ...settings, meta: updatedMeta },
          is_active: true
        }),
      });
      alert(`Página "${pageObj.name}" seleccionada correctamente.`);
    } catch (err) {
      console.error("Error al guardar la página:", err);
      alert("No se pudo guardar la selección de la página.");
    }
  };

  const handleConnectFacebook = async () => {
    if (!workspaceUid) return;
    setIsConnectingFb(true);
    try {
      const response = await apiFetch(`/integrations/facebook/redirect?company_uid=${workspaceUid}`, {
        method: 'GET',
      });
      if (response && response.url) {
        window.location.href = response.url;
      }
    } catch (err: any) {
      console.error("Error al conectar con Facebook:", err);
      alert("Ocurrió un error al intentar conectar con Facebook.");
    } finally {
      setIsConnectingFb(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-foreground font-medium">
        <Facebook className="h-4 w-4 text-blue-600" />
        <h3 className="text-base">Meta (Facebook e Instagram)</h3>
      </div>

      <div className="pl-6 grid gap-4">
        <div className="rounded-lg border p-4 bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Conexión de Cuenta Publicitaria y Páginas</h4>
            <p className="text-sm text-muted-foreground">
              Vincula tu cuenta para extraer métricas de publicaciones, reels y rendimiento de campañas.
            </p>
          </div>

          <div className="shrink-0">
            {settings.meta ? (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 px-4 py-2 rounded-full font-medium border border-green-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  Conectado como {settings.meta.account_name}
                </div>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs text-muted-foreground h-auto p-0"
                  onClick={handleConnectFacebook}
                >
                  Reconectar / Cambiar cuenta
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectFacebook}
                disabled={isConnectingFb}
                className="gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isConnectingFb ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Facebook className="h-4 w-4" />
                    Conectar con Facebook
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {settings.meta && (
          <div className="rounded-lg border p-4 bg-muted/30 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold">Selecciona la Página a Monitorear</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Elige la página de Facebook de la cual extraeremos las estadísticas de publicaciones y reels.
            </p>

            {loadingPages ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando tus páginas de Meta...
              </div>
            ) : pages.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="flex h-9 w-full sm:w-80 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">-- Selecciona una página --</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>

                <Button 
                  onClick={handleSaveSelectedPage}
                  size="sm"
                  disabled={!selectedPageId}
                  className="w-full sm:w-auto"
                >
                  Guardar Página
                </Button>
              </div>
            ) : (
              <p className="text-xs text-amber-600 font-medium">
                No se encontraron páginas administradas por esta cuenta.
              </p>
            )}

            {settings.meta.selected_page_name && (
              <div className="text-xs text-green-600 font-medium flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Página activa actualmente: <strong>{settings.meta.selected_page_name}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}