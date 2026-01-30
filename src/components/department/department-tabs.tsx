"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DepartmentTeam } from "./department-team";
import { DepartmentNotices } from "./department-notices";
import { DepartmentResources } from "./department-resources";

export function DepartmentTabs({ departmentUid }: { departmentUid: string }) {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="team">Equipo</TabsTrigger>
        <TabsTrigger value="notices">Avisos</TabsTrigger>
        <TabsTrigger value="resources">Recursos</TabsTrigger>
      </TabsList>

      <TabsContent value="team" className="mt-6">
        {activeTab === "team" && (
          <DepartmentTeam departmentUid={departmentUid} />
        )}
      </TabsContent>

      <TabsContent value="notices" className="mt-6">
        {activeTab === "notices" && (
          <DepartmentNotices departmentUid={departmentUid} />
        )}
      </TabsContent>

      <TabsContent value="resources" className="mt-6">
        {activeTab === "resources" && <DepartmentResources />}
      </TabsContent>
    </Tabs>
  );
}
