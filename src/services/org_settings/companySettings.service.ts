// C:\YEL\yel-services-frontend\src\services\org_settings\companySettings.service.ts
import { apiFetch } from '@/services/http';

export const companySettingsService = {
  getSettings: async <T>(companyUid: string, moduleName: string): Promise<T | null> => {
    const response = await apiFetch(`/org-companies/${companyUid}/modules/${moduleName}/settings`, {
      method: 'GET',
    });
    
    // Si response.data.settings es null, regresamos null para que el hook use los defaults
    return response.data?.settings ?? null;
  },

  updateSettings: async <T>(
    companyUid: string, 
    moduleName: string, 
    settings: T, 
    isActive: boolean = true
  ) => {
    return await apiFetch(`/org-companies/${companyUid}/modules/${moduleName}/settings`, {
      method: 'PUT',
      body: JSON.stringify({
        settings,
        is_active: isActive,
      }),
    });
  },
};