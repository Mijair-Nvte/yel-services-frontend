"use client";

import { Edit2, Trash2, User, Users, Calendar, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ServiceOrderListProps {
  orders: any[];
  onEdit: (order: any) => void;
  onDelete: (uid: string) => void;
}

// Mapas de estilo para los estatus del pipeline
const statusMap: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pendiente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  in_progress: {
    label: "En Proceso",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  waiting_client: {
    label: "Esperando Cliente",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  review: {
    label: "En Revisión",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  completed: {
    label: "Completado",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export function ServiceOrderList({
  orders,
  onEdit,
  onDelete,
}: ServiceOrderListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => {
        const status = statusMap[order.status] || {
          label: order.status,
          className: "bg-slate-50 text-slate-700",
        };

        return (
          <Card
            key={order.uid}
            className="bg-white dark:bg-slate-900 border-border/60 shadow-sm rounded-2xl hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Header de la Tarjeta */}
            <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                  #{order.uid.toLowerCase()}
                </span>
                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {order.service?.name || "Servicio Adquirido"}
                </h3>
              </div>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            </CardHeader>

            {/* Contenido / Detalles del trámite */}
            <CardContent className="p-5 pt-0 pb-4 space-y-3 flex-1 text-sm text-slate-600 dark:text-slate-400">
              {/* Cliente */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {order.customer?.first_name} {order.customer?.last_name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {order.customer?.email}
                  </p>
                </div>
              </div>

              {/* Fecha y Monto cobrado */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(order.created_at)}
                </div>
                <div className="flex items-center gap-0.5 font-bold text-slate-700 dark:text-slate-300">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  {order.sale?.total_amount
                    ? `${order.sale.total_amount} USD`
                    : "N/A"}
                </div>
              </div>

              {/* Personal Involucrado (Owner & Followers) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {/* Asignado principal */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Responsable:
                  </span>
                  {order.assignee ? (
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={order.assignee.profile?.avatar_url} />
                        <AvatarFallback className="text-[8px] bg-slate-200">
                          {order.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {order.assignee.name}
                    </div>
                  ) : (
                    <span className="text-amber-600 italic font-medium">
                      Sin asignar
                    </span>
                  )}
                </div>

                {/* Equipo de apoyo */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Equipo de apoyo:
                  </span>
                  <div className="flex items-center gap-1">
                    {order.followers && order.followers.length > 0 ? (
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {order.followers.slice(0, 3).map((follower: any) => (
                          <Avatar
                            key={follower.id}
                            className="h-5 w-5 ring-2 ring-white dark:ring-slate-900 shrink-0"
                          >
                            <AvatarImage src={follower.profile?.avatar_url} />
                            <AvatarFallback className="text-[8px] bg-indigo-50 text-indigo-700 font-bold">
                              {follower.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {order.followers.length > 3 && (
                          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-[8px] font-bold text-slate-500 ring-2 ring-white dark:ring-slate-900 z-10 pl-0.5">
                            +{order.followers.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Ninguno</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Footer de la Tarjeta con Acciones */}
            <CardFooter className="p-4 bg-slate-50/50 dark:bg-slate-900/40 border-t border-border/40 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
                onClick={() => onEdit(order)}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Gestionar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-slate-400 hover:text-red-600 hover:bg-red-50/50"
                onClick={() => {
                  if (
                    confirm(
                      "¿Estás seguro de eliminar este registro de servicio operativo?",
                    )
                  ) {
                    onDelete(order.uid);
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
