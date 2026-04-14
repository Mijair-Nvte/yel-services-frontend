"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { SalesHeader } from "@/components/sales/sales-header";
import { SalesTable } from "@/components/sales/sales-table";
import { SaleSheet } from "@/components/sales/sale-sheet";
import { useSales } from "@/hooks/sales/useSales";
import { format, isWithinInterval, parseISO } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, FilterX, Loader2 } from "lucide-react";
import { SalesService } from "@/services/org_sales/sales.service";

export default function SalesPage() {
  const params = useParams();
  const workspaceUid = params.workspaceUid as string;

  const { sales, isLoading, updateStatus } = useSales(workspaceUid);

  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedSeller, setSelectedSeller] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (filteredSales.length === 0) return; // No exportar si no hay nada en la tabla

    try {
      setIsExporting(true);

      // Extraemos solo los IDs de las ventas filtradas actualmente
      const saleIds = filteredSales.map((sale) => sale.id);

      // Llamamos al servicio
      const blob = await SalesService.exportPdf(workspaceUid, saleIds);

      // Magia del navegador para descargar el blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Nombre del archivo dinámico
      const fileName = `Reporte_${selectedSeller !== "all" ? "Vendedor" : "General"}_${format(new Date(), "ddMMyyyy")}.pdf`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar:", error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsExporting(false);
    }
  };

  // --- EXTRAER VENDEDORES ÚNICOS PARA EL SELECT ---
  const uniqueSellers = useMemo(() => {
    const sellersMap = new Map();
    sales.forEach((sale) => {
      if (sale.seller) {
        sellersMap.set(sale.seller.id, sale.seller.name);
      }
    });
    return Array.from(sellersMap.entries()).map(([id, name]) => ({ id, name }));
  }, [sales]);

  // --- LÓGICA DE FILTRADO ---
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // 1. Filtro por Vendedor
      const matchSeller =
        selectedSeller === "all" ||
        sale.seller?.id?.toString() === selectedSeller;

      // 2. Filtro por Estatus
      const matchStatus =
        selectedStatus === "all" || sale.commission_status === selectedStatus;

      // 3. Filtro por Rango de Fecha
      let matchDate = true;
      if (dateRange?.from) {
        // Tomamos la fecha de pago si ya está pagado, o la fecha de creación si está pendiente
        // Esto cubre tu lógica de "reencuentro" de quincenas pasadas pagadas hoy
        const targetDateStr =
          sale.commission_status === "paid" && sale.seller_payout_date
            ? sale.seller_payout_date
            : sale.created_at;

        const saleDate = parseISO(targetDateStr);
        const fromDate = dateRange.from;
        const toDate = dateRange.to || dateRange.from; // Si no hay 'to', buscamos solo el día 'from'

        // Seteamos las horas para abarcar todo el día
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        matchDate = saleDate >= fromDate && saleDate <= toDate;
      }

      return matchSeller && matchStatus && matchDate;
    });
  }, [sales, selectedSeller, selectedStatus, dateRange]);

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

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedSeller("all");
    setSelectedStatus("all");
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-slate-900">
            Listado de Transacciones
          </h3>

          {/* --- BOTÓN DE EXPORTAR (Por ahora solo diseño, lo conectamos a Laravel después) --- */}
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleExportPDF}
            disabled={isExporting || filteredSales.length === 0}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            {isExporting ? "Generando PDF..." : "Exportar Recibo PDF"}
          </Button>
        </div>

        {/* --- BARRA DE FILTROS --- */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />

          <Select value={selectedSeller} onValueChange={setSelectedSeller}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Vendedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los vendedores</SelectItem>
              {uniqueSellers.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estatus</SelectItem>
              <SelectItem value="paid">Pagados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>

          {(dateRange ||
            selectedSeller !== "all" ||
            selectedStatus !== "all") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetFilters}
              className="text-slate-500 hover:text-rose-600"
              title="Limpiar filtros"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* --- TABLA (AHORA RECIBE filteredSales) --- */}
        <SalesTable
          sales={filteredSales}
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
