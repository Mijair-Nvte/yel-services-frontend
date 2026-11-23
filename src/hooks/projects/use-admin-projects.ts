"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { OrgProjectService, OrgProject, CreateProjectDto } from "@/services/projects/org-project.service";

export function useAdminProjects(workspaceUid: string) {
  const [projects, setProjects] = useState<OrgProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!workspaceUid) return;
    setIsLoading(true);
    try {
      const res = await OrgProjectService.getAll(workspaceUid);
      setProjects(res || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Error al cargar los proyectos.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceUid]);

  const createProject = async (data: CreateProjectDto) => {
    try {
      await OrgProjectService.create(workspaceUid, data);
      toast.success("Proyecto creado correctamente.");
      await loadData();
    } catch (error: unknown) {
      toast.error("Ocurrió un error al crear el proyecto.");
      throw error;
    }
  };

  const updateProject = async (projectUid: string, data: Partial<CreateProjectDto>) => {
    try {
      await OrgProjectService.update(workspaceUid, projectUid, data);
      toast.success("Proyecto actualizado correctamente.");
      await loadData();
    } catch (error: unknown) {
      toast.error("Ocurrió un error al actualizar el proyecto.");
      throw error;
    }
  };

  const deleteProject = async (projectUid: string) => {
    try {
      await OrgProjectService.delete(workspaceUid, projectUid);
      toast.success("Proyecto eliminado correctamente.");
      await loadData();
    } catch (error: unknown) {
      toast.error("Error al eliminar el proyecto.");
      throw error;
    }
  };

  return {
    projects,
    isLoading,
    loadData,
    createProject,
    updateProject,
    deleteProject,
  };
}