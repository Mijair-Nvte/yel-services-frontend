"use client"

import { useEffect, useState } from "react"
import { DepartmentService } from "@/services/org_department/org-area.service"

export function useDepartments(workspaceUid: string) {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadDepartments = async () => {
    setLoading(true)
    try {
      const data = await DepartmentService.list(workspaceUid)
      setDepartments(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (workspaceUid) {
      loadDepartments()
    }
  }, [workspaceUid])

  return {
    departments,
    loading,
    reload: loadDepartments,
  }
}
