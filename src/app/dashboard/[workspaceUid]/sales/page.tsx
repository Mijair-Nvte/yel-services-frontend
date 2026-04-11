"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { SalesHeader } from "@/components/sales/sales-header";
import { SalesTable } from "@/components/sales/sales-table";
import { SaleSheet } from "@/components/sales/sale-sheet";
import { useSales } from "@/hooks/sales/useSales";
import { format } from "date-fns";
export default function SalesPage() {
  const params = useParams();
  const workspaceUid = params.workspaceUid as string;

  const { sales, isLoading, updateStatus } = useSales(workspaceUid);

  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleUpdateCommissionStatus = async (
    saleId: number,
    newStatus: string,
    date: Date | null,
    amount: number, // <--- AGREGAR ESTE PARÁMETRO
  ) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

    // Pasamos el amount al hook
    await updateStatus(saleId, newStatus, formattedDate, amount);

    if (selectedSale && selectedSale.id === saleId) {
      setSelectedSale({
        ...selectedSale,
        commission_status: newStatus,
        seller_payout_date: formattedDate,
        commission_amount: amount, // <--- ACTUALIZAR TAMBIÉN EL ESTADO LOCAL
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Cargando transacciones...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <SalesHeader sales={sales} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            Listado de Transacciones Sincronizadas
          </h3>
        </div>

        <SalesTable
          sales={sales}
          onViewDetail={(sale: any) => {
            setSelectedSale(sale);
            setSheetOpen(true);
          }}
        />
      </div>

      <SaleSheet
        open={sheetOpen}
        sale={selectedSale}
        onClose={() => {
          setSheetOpen(false);
          setSelectedSale(null);
        }}
        onUpdateCommissionStatus={handleUpdateCommissionStatus}
      />
    </div>
  );
}
