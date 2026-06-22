"use client";

import { Building, MapPin, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatMoney = (amount: number | string) => {
  const safeAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(safeAmount || 0);
};

export function AdminPropertiesTable({ properties, onEdit, onDelete }: any) {
  return (
    <div className="rounded border bg-white overflow-hidden ">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Propiedad</TableHead>
            <TableHead>Inversión</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!Array.isArray(properties) || properties.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-400">Sin propiedades</TableCell></TableRow>
          ) : (
            properties.map((p) => (
              <TableRow key={p.uid}>
                <TableCell>
                  <div className="flex items-center gap-3 font-medium text-slate-900">{p.title}</div>
                </TableCell>
                <TableCell>{formatMoney(p.investment_amount)}</TableCell>
                <TableCell>
                  {/* AQUÍ ESTÁ EL CAMBIO: Usamos p.owner */}
                  {p.owner ? (
                    <Badge variant="secondary">{p.owner.name}</Badge>
                  ) : (
                    <span className="text-slate-400 text-sm">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                    <Badge className={p.status === 'closed' ? "bg-emerald-100 text-emerald-800" : "bg-slate-100"}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(p)}><Pencil className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(p)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}