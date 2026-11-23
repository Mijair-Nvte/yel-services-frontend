"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { OrgTaskService, OrgProjectTask, SaveTaskDto } from "@/services/projects/org-task.service";

export function useProjectTasks(workspaceUid: string, projectUid: string) {
  const [tasks, setTasks] = useState<OrgProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!workspaceUid || !projectUid) return;
    setIsLoading(true);
    try {
      const res = await OrgTaskService.getAll(workspaceUid, projectUid);
      setTasks(res || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Error al cargar las tareas del proyecto.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceUid, projectUid]);

  const createTask = async (data: SaveTaskDto) => {
    try {
      await OrgTaskService.create(workspaceUid, projectUid, data);
      toast.success("Tarea creada correctamente.");
      await loadTasks();
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al crear la tarea.");
      throw error;
    }
  };

  const updateTask = async (taskUid: string, data: Partial<SaveTaskDto>) => {
    try {
      await OrgTaskService.update(workspaceUid, projectUid, taskUid, data);
      toast.success("Tarea actualizada correctamente.");
      await loadTasks();
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al actualizar la tarea.");
      throw error;
    }
  };

  const deleteTask = async (taskUid: string) => {
    try {
      await OrgTaskService.delete(workspaceUid, projectUid, taskUid);
      toast.success("Tarea eliminada correctamente.");
      await loadTasks();
    } catch (error: any) {
      toast.error("Error al eliminar la tarea.");
      throw error;
    }
  };

  return {
    tasks,
    isLoading,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}