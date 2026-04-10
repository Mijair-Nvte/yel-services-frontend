"use client";

import { Eye, Store, Link as LinkIcon, User, DollarSign, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  if (status === "paid")
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        Pagada
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
        Pendiente
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 px-2.5 py-0.5 rounded-full">
      No aplica
    </Badge>
  );
};

export function SalesTable({ sales, onViewDetail }: { sales: any[]; onViewDetail: (s: any) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] font-bold text-slate-600">Fecha</TableHead>
            <TableHead className="font-bold text-slate-600">Cliente / Servicio</TableHead>
            <TableHead className="font-bold text-slate-600">Origen</TableHead>
            <TableHead className="font-bold text-slate-600">Monto Bruto</TableHead>
            <TableHead className="font-bold text-slate-600">Vendedor</TableHead>
            <TableHead className="font-bold text-slate-600">Comisión</TableHead>
            <TableHead className="font-bold text-slate-600">Estatus</TableHead>
            <TableHead className="text-right font-bold text-slate-600">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-slate-400 italic">No hay ventas registradas.</TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => {
              const isLink = sale.source_type === "payment_link";
              return (
                <TableRow key={sale.id} className={`group transition-colors hover:bg-slate-50/50 ${!isLink ? "opacity-70 bg-slate-50/30" : ""}`}>
                  <TableCell className="text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(sale.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-white shadow-sm ring-1 ring-slate-200">
                        <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">{sale.customer_name?.charAt(0) || "C"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{sale.customer_name || "Desconocido"}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{sale.product_name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {isLink ? <LinkIcon className="h-3.5 w-3.5 text-blue-600" /> : <Store className="h-3.5 w-3.5 text-slate-600" />}
                      <span className="text-xs font-bold">{isLink ? "Link" : "Store"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900 text-sm">{formatMoney(Number(sale.total_amount))}</TableCell>
                  <TableCell>
                    {isLink && sale.seller ? (
                      <span className="text-sm font-semibold text-slate-700">{sale.seller.name}</span>
                    ) : isLink ? (
                      <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 text-[10px] font-bold">⚠️ Sin Mapear</Badge>
                    ) : <span className="text-xs text-slate-400 italic">Venta Directa</span>}
                  </TableCell>
                  <TableCell>
                    {isLink ? (
                      <div className="text-emerald-700 font-black text-sm">{formatMoney(Number(sale.commission_amount))}</div>
                    ) : <span className="text-slate-300">—</span>}
                  </TableCell>
                  <TableCell>{getStatusBadge(sale.commission_status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(sale)} disabled={!isLink} className="h-8 border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}