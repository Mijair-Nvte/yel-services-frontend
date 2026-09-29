"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2, Users, UserPlus, Mail, Phone } from "lucide-react";
import { useAdminCustomers } from "@/hooks/org_customers/use-customers";
import { CustomerTable } from "@/components/org_customers/customer-admin-table";
import { OrgCustomer } from "@/services/org-customer/org-customer.service";
import { KpiCards, KpiItem } from "@/components/ui/kpi-cards";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function PageCustomers() {
  const router = useRouter();
  const { workspaceUid } = useParams() as { workspaceUid: string };
  const { customers, meta, isLoading, loadData, deleteCustomer } = useAdminCustomers(workspaceUid);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Pasamos pageIndex + 1 porque Laravel espera página 1, 2, 3...
      loadData(pagination.pageIndex + 1, pagination.pageSize, search);
    }, 400); // 400ms de debounce para no saturar al teclear

    return () => clearTimeout(delayDebounce);
  }, [pagination.pageIndex, pagination.pageSize, search, loadData]);

  // Cálculo de KPIs dinámicos para Clientes
  const kpiItems: KpiItem[] = useMemo(() => {
    const totalReal = meta?.total || 0;
    const newCustomers = meta?.kpis?.new_7_days || 0;
    const withEmail = meta?.kpis?.with_email || 0;
    const withPhone = meta?.kpis?.with_phone || 0;

    return [
      {
        label: "Total Clientes",
        value: totalReal,
        icon: Users,
        color: "text-blue-600",
        iconBg: "bg-blue-100",
        cardBg: "bg-blue-50/50 dark:bg-blue-950/20",
        hoverShadow: "hover:shadow-blue-500/20",
        borderColor: "hover:border-blue-400",
        subtitle: "En tu base de datos"
      },
      {
        label: "Nuevos (Últimos 7 días)",
        value: newCustomers,
        icon: UserPlus,
        color: "text-emerald-600",
        iconBg: "bg-emerald-100",
        cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
        hoverShadow: "hover:shadow-emerald-500/20",
        borderColor: "hover:border-emerald-400",
        subtitle: "Adquisición reciente"
      },
      {
        label: "Con Correo Electrónico",
        value: withEmail,
        icon: Mail,
        color: "text-indigo-600",
        iconBg: "bg-indigo-100",
        cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
        hoverShadow: "hover:shadow-indigo-500/20",
        borderColor: "hover:border-indigo-400",
        subtitle: "Listos para campañas"
      },
      {
        label: "Con Teléfono",
        value: withPhone,
        icon: Phone,
        color: "text-amber-600",
        iconBg: "bg-amber-100",
        cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
        hoverShadow: "hover:shadow-amber-500/20",
        borderColor: "hover:border-amber-400",
        subtitle: "Contacto directo"
      }
    ];
  }, [customers, meta]);


  // Filtrado de búsqueda en tiempo real
  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const lowerSearch = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.first_name.toLowerCase().includes(lowerSearch) ||
        (c.last_name?.toLowerCase().includes(lowerSearch)) ||
        (c.email?.toLowerCase().includes(lowerSearch)) ||
        (c.phone?.includes(lowerSearch))
    );
  }, [customers, search]);

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Gestión de Clientes (CRM)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra los contactos y clientes.
          </p>
        </div>
        <div>
          {/* Botón preparado para cuando hagamos el Sheet */}
          <Button onClick={() => {
            // setSelectedCustomer(null);
            // setIsSheetOpen(true);
            alert("El formulario (Sheet) se implementará en el siguiente paso.");
          }}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Tarjetas de KPIs Modulares */}
      {!isLoading && <KpiCards items={kpiItems} columns="sm:grid-cols-2 lg:grid-cols-4" />}

      {/* Grid de Contenido */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">Cargando clientes...</p>
        </div>
      ) : (
        <CustomerTable
          customers={customers}

          meta={meta}
          pagination={pagination}
          onPaginationChange={setPagination}

          onView={(customer) => router.push(`/dashboard/${workspaceUid}/customers/${customer.uid}`)}
          onDelete={async (uid: string) => {
            if (confirm("¿Estás seguro?")) await deleteCustomer(uid);
          }}
        />
      )}

      {/* Sheet de Creación/Edición Lateral (Comentado hasta el próximo paso) */}
      {/* <CustomerAdminSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        customer={selectedCustomer}
        onCreate={createCustomer}
        onUpdate={updateCustomer}
      /> */}
    </div>
  );
}