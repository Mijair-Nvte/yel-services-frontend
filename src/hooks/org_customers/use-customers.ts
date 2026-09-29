"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { OrgCustomerService, OrgCustomer, CreateCustomerDto, UpdateCustomerDto,PaginatedMeta } from "@/services/org-customer/org-customer.service";

export function useAdminCustomers(workspaceUid: string) {
    const [customers, setCustomers] = useState<OrgCustomer[]>([]);
   const [meta, setMeta] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

const loadData = useCallback(async (page: number = 1, perPage: number = 100, search: string = "") => {
        if (!workspaceUid) return;
        setIsLoading(true);
        try {
            const res = await OrgCustomerService.getAll(workspaceUid, page, perPage, search);
            setCustomers(res.data || []);
            setMeta(res.meta || null); // Guardamos la metadata de Laravel
        } catch (error) {
            toast.error("Error al cargar los clientes.");
        } finally {
            setIsLoading(false);
        }
    }, [workspaceUid]);

    const createCustomer = async (data: CreateCustomerDto) => {
        try {
            await OrgCustomerService.create(workspaceUid, data);
            toast.success("Cliente creado correctamente.");
            await loadData();
        } catch (error: unknown) {
            toast.error("Ocurrió un error al crear el cliente.");
            throw error;
        }
    };

    const updateCustomer = async (customerUid: string, data: UpdateCustomerDto) => {
        try {
            await OrgCustomerService.update(workspaceUid, customerUid, data);
            toast.success("Cliente actualizado correctamente.");
            await loadData();
        } catch (error: unknown) {
            toast.error("Ocurrió un error al actualizar el cliente.");
            throw error;
        }
    };

    const deleteCustomer = async (customerUid: string) => {
        try {
            await OrgCustomerService.delete(workspaceUid, customerUid);
            toast.success("Cliente eliminado correctamente.");
            await loadData();
        } catch (error: unknown) {
            toast.error("Error al eliminar el cliente.");
            throw error;
        }
    };

    return {
        customers,
        meta,
        isLoading,
        loadData,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    };
}