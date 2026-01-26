"use client";

import { useParams } from "next/navigation";
import { useDepartment } from "@/hooks/departments/use-department-detail";

import { DepartmentHeader } from "@/components/department/department-header";
import { DepartmentTabs } from "@/components/department/department-tabs";

export default function DepartmentDetailPage() {
  const { departmentUid } = useParams<{ departmentUid: string }>();
  const { department, loading } = useDepartment(departmentUid);

  if (loading) {
    return <div className="p-6">Loading department...</div>;
  }

  if (!department) {
    return <div className="p-6">Department not found</div>;
  }

  return (
    <div className="space-y-6">
      <DepartmentHeader department={department} />

      {/* Tabs del departamento */}
      <DepartmentTabs departmentUid={departmentUid} />
    </div>
  );
}
