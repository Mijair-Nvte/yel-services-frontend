"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // 👈 Importamos useParams
import { DepartmentService } from "@/services/org_department/org-area.service";

export function useDepartment(departmentUid: string) {
  const { workspaceUid } = useParams<{ workspaceUid: string }>(); // 👈 Obtenemos el workspaceUid
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDepartment = async () => {
    if (!workspaceUid || !departmentUid) return; // 👈 Evitamos el 'undefined' en la URL
    
    setLoading(true);
    try {
      // ✅ Pasamos ambos UIDs al servicio
      const data = await DepartmentService.get(workspaceUid, departmentUid);
      setDepartment(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartment();
  }, [workspaceUid, departmentUid]);

  return {
    department,
    loading,
    reload: loadDepartment,
  };
}