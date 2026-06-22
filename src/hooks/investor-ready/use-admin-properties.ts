import { useState, useEffect, useCallback } from "react";
import { AdminPropertiesService } from "@/services/investor-ready/admin-properties.service";
// Importamos tu servicio de usuarios existente
import { OrgUserService } from "@/services/org_settings/users/org-user.service";

export function useAdminProperties(workspaceUid: string) {
  const [properties, setProperties] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!workspaceUid) return;
    try {
      setIsLoading(true);
      
      // Hacemos las dos llamadas en paralelo usando tu OrgUserService
      const [propsData, usersResponse] = await Promise.all([
        AdminPropertiesService.getProperties(workspaceUid),
        OrgUserService.getDirectory(workspaceUid)
      ]);
      
      setProperties(propsData);
      // Aseguramos extraer el .data de tu respuesta del directorio si tu API lo envuelve así
      setUsers(usersResponse?.data || []); 
      
    } catch (err: any) {
      console.error("Error obteniendo datos del admin:", err);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceUid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProperty = async (payload: any) => {
    const newProp = await AdminPropertiesService.createProperty(workspaceUid, payload);
    setProperties((prev) => [newProp, ...prev]);
    return newProp;
  };

  const editProperty = async (propertyUid: string, payload: any) => {
    const updatedProp = await AdminPropertiesService.updateProperty(workspaceUid, propertyUid, payload);
    setProperties((prev) => prev.map((p) => (p.uid === propertyUid ? updatedProp : p)));
    return updatedProp;
  };

  const removeProperty = async (propertyUid: string) => {
    await AdminPropertiesService.deleteProperty(workspaceUid, propertyUid);
    setProperties((prev) => prev.filter((p) => p.uid !== propertyUid));
  };

  return { 
    properties, 
    users, 
    isLoading, 
    addProperty, 
    editProperty, 
    removeProperty, 
    refresh: fetchData 
  };
}