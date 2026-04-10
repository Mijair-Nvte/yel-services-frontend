"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, LinkIcon, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MappingsTable({ data, isLoading, onEdit, onDelete }: any) {
  if (isLoading)
    return (
      <div className="py-10 text-center text-slate-500">Cargando mapeos...</div>
    );

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold">Servicio</TableHead>
            <TableHead className="font-bold">ID GHL</TableHead>
            <TableHead className="font-bold">Vendedor</TableHead>
            <TableHead className="font-bold">Estado</TableHead>
            <TableHead className="text-right font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow
              key={item.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-bold text-slate-900">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  {item.service_name}
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-slate-500">
                {item.ghl_payment_link_id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 border border-slate-200">
                    <AvatarFallback className="text-[10px] font-bold">
                      {item.seller?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">
                    {item.seller?.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    item.is_active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-100 text-slate-500"
                  }
                >
                  {item.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 text-slate-400 hover:text-slate-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.uid)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
