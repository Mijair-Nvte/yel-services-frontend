// C:\YEL\yel-services-frontend\src\hooks\org_company_settings\useCompanySettings.ts
import { useState, useEffect, useCallback } from 'react';
import { companySettingsService } from '@/services/org_settings/companySettings.service';

export function useCompanySettings<T>(companyUid: string, moduleName: string, defaultSettings: T) {
  const [settings, setSettings] = useState<T>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    // Si no hay UID o módulo, detenemos la carga para que no se quede colgado
    if (!companyUid || !moduleName) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await companySettingsService.getSettings<T>(companyUid, moduleName);
      
      if (data) {
        // Si ya hay configuraciones guardadas en la BD, las fusionamos con los defaults 
        // para evitar errores si en el futuro agregas nuevas propiedades al JSON.
        setSettings((prev) => ({
          ...prev,
          ...data,
        }));
      } else {
        // Si no existen (es null), nos aseguramos de usar los defaultSettings que pasamos
        setSettings(defaultSettings);
      }
    } catch (err: any) {
      console.error(`Error al cargar settings de ${moduleName}:`, err);
      setError(err?.message || 'No se pudo cargar la configuración.');
    } finally {
      // GARANTÍA: El loading siempre se apaga, haya datos o falle la petición
      setIsLoading(false);
    }
  }, [companyUid, moduleName]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async () => {
    if (!companyUid || !moduleName) return;

    setIsSaving(true);
    try {
      // Como tu backend usa updateOrCreate, esta misma petición CREARÁ el registro 
      // si no existe, o lo actualizará si ya existe. ¡Funciona para ambos casos!
      await companySettingsService.updateSettings<T>(companyUid, moduleName, settings);
      alert('Configuración guardada correctamente');
    } catch (err: any) {
      console.error(`Error al guardar settings de ${moduleName}:`, err);
      alert('Ocurrió un error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    setSettings,
    isLoading,
    isSaving,
    error,
    saveSettings,
    reload: fetchSettings,
  };
}