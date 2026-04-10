"use client";

import { Eye, Store, Link as LinkIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SalesListProps {
  sales: any[];
  onViewDetail: (sale: any) => void;
}

export function SalesList({ sales, onViewDetail }: SalesListProps) {
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente / Origen</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Vendedor (8%)</TableHead>
            <TableHead>Tramitador (5%)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.uid}>
              <TableCell className="text-sm">{sale.date}</TableCell>
              
              {/* Cliente y Origen (Store vs Link) */}
              <TableCell>
                <div className="font-medium text-slate-900">{sale.client_name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {sale.source_type === "payment_link" ? (
                    <LinkIcon className="h-3 w-3 text-blue-500" />
                  ) : (
                    <Store className="h-3 w-3 text-orange-500" />
                  )}
                  <span className="truncate max-w-[200px]" title={sale.source_name}>
                    {sale.source_name}
                  </span>
                </div>
              </TableCell>

              <TableCell className="font-semibold">${sale.total_amount.toFixed(2)}</TableCell>

              {/* Columna Vendedor */}
              <TableCell>
                {sale.source_type === "payment_link" ? (
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-sm font-medium">{sale.seller?.name || "Sin asignar"}</span>
                    <Badge variant="outline" className={sale.seller?.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}>
                      {sale.seller?.status === "paid" ? "Pagado" : "Pendiente"}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No aplica (Tienda)</span>
                )}
              </TableCell>

              {/* Columna Tramitador */}
              <TableCell>
                {sale.source_type === "payment_link" && sale.processor ? (
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-sm font-medium">{sale.processor.name}</span>
                    <Badge variant="outline" className={sale.processor?.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}>
                      {sale.processor?.status === "paid" ? "Pagado" : "Pendiente"}
                    </Badge>
                  </div>
                ) : sale.source_type === "payment_link" ? (
                  <span className="text-xs text-slate-400">Sin tramitador</span>
                ) : (
                  <span className="text-xs text-slate-400 italic">No aplica</span>
                )}
              </TableCell>

              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewDetail(sale)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Liquidar / Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}