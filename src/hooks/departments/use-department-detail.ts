"use client";

import { useEffect, useState } from "react";
import { DepartmentService } from "@/services/org_department/org-area.service";

export function useDepartment(departmentUid: string) {
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDepartment = async () => {
    setLoading(true);
    try {
      const data = await DepartmentService.get(departmentUid);
      setDepartment(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentUid) {
      loadDepartment();
    }
  }, [departmentUid]);

  return {
    department,
    loading,
    reload: loadDepartment,
  };
}
