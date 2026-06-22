"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAdminProperties } from "@/hooks/investor-ready/use-admin-properties";
import { AdminPropertiesTable } from "@/components/investor-ready/admin-properties-table";
import { AdminPropertySheet } from "@/components/investor-ready/admin-property-sheet";

export default function AdminPropertiesPage() {
  const params = useParams();
  const workspaceUid = params.workspaceUid as string;

  const { properties, users, isLoading, addProperty, editProperty, removeProperty } = useAdminProperties(workspaceUid);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setSelectedProperty(null);
    setSheetOpen(true);
  };

  const handleOpenEdit = (property: any) => {
    setSelectedProperty(property);
    setSheetOpen(true);
  };

  const handleDelete = async (property: any) => {
    if (window.confirm(`¿Estás seguro de eliminar la propiedad "${property.title}"? Esta acción no se puede deshacer.`)) {
      await removeProperty(property.uid);
    }
  };

  const handleSave = async (payload: any) => {
    if (selectedProperty) {
      await editProperty(selectedProperty.uid, payload);
    } else {
      await addProperty(payload);
    }
  };

  // --- RENDER ---
  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-slate-500">Cargando inventario...</div>;
  }

  return (
    <div className="space-y-8 p-1 pb-20 ">
      
      {/* HEADER DIRECTO SIN COMPONENTE EXTERNO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Inventario de Propiedades
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Gestiona las propiedades de la empresa, actualiza los retornos de inversión y asígnalas a los partners correspondientes.
          </p>
        </div>

        <Button 
          onClick={handleOpenCreate} 
          
        >
          <Plus className="h-4 w-4 mr-2" /> 
          Añadir Propiedad
        </Button>
      </div>

      <AdminPropertiesTable 
        properties={properties} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <AdminPropertySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        property={selectedProperty}
        users={users}
        onSave={handleSave}
      />
    </div>
  );
}