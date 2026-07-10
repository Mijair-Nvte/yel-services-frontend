"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceOrderBoardProps {
  orders: any[];
  onEdit: (order: any) => void;
}

// Configuración de las columnas del Pipeline
const PIPELINE_STAGES = [
  {
    id: "pending",
    label: "Pendiente",
    color: "bg-blue-500",
    dotClass: "bg-blue-500",
  },
  {
    id: "in_progress",
    label: "En Proceso",
    color: "bg-indigo-500",
    dotClass: "bg-indigo-500",
  },
  {
    id: "waiting_client",
    label: "Esp. Cliente",
    color: "bg-amber-500",
    dotClass: "bg-amber-500",
  },
  {
    id: "review",
    label: "En Revisión",
    color: "bg-purple-500",
    dotClass: "bg-purple-500",
  },
  {
    id: "completed",
    label: "Completado",
    color: "bg-emerald-500",
    dotClass: "bg-emerald-500",
  },
  {
    id: "cancelled",
    label: "Cancelado",
    color: "bg-rose-500",
    dotClass: "bg-rose-500",
  },
];

export function ServiceOrderBoard({ orders, onEdit }: ServiceOrderBoardProps) {
  // Agrupamos las órdenes por estado y calculamos totales
  const groupedOrders = useMemo(() => {
    const groups: Record<string, { items: any[]; totalValue: number }> = {};

    PIPELINE_STAGES.forEach((stage) => {
      groups[stage.id] = { items: [], totalValue: 0 };
    });

    orders.forEach((order) => {
      const status = order.status || "pending";
      if (groups[status]) {
        groups[status].items.push(order);
        // Sumamos el valor si existe
        if (order.sale?.total_amount) {
          groups[status].totalValue += Number(order.sale.total_amount);
        }
      }
    });

    return groups;
  }, [orders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex h-full w-full overflow-x-auto pb-6 snap-x snap-mandatory ">
      <div className="flex gap-4 min-w-max px-1">
        {PIPELINE_STAGES.map((stage) => {
          const columnData = groupedOrders[stage.id];
          const count = columnData.items.length;

          return (
            <div
              key={stage.id}
              className="flex flex-col w-[320px] shrink-0 snap-start"
            >
              {/* HEADER DE LA COLUMNA */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn("h-2.5 w-2.5 rounded-full", stage.dotClass)}
                  />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {stage.label}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </div>
                {columnData.totalValue > 0 && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    ${columnData.totalValue.toLocaleString("en-US")}
                  </span>
                )}
              </div>

              {/* CONTENEDOR DE TARJETAS (Fondo sutil de la columna) */}
              <div className="flex-1 bg-slate-200/50 dark:bg-slate-900/20 rounded-2xl p-2.5 flex flex-col gap-2.5 border border-slate-100 dark:border-slate-800/60 min-h-[500px]">
                {columnData.items.map((order) => (
                  <div
                    key={order.uid}
                    onClick={() => onEdit(order)}
                    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/50 cursor-pointer transition-all group relative overflow-hidden"
                  >
                    {/* Borde superior decorativo que aparece al hacer hover */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-0.5">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {order.service?.name || "Servicio"}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {order.sale?.total_amount
                            ? `$${Number(order.sale.total_amount).toLocaleString("en-US")}`
                            : "Sin cobro"}
                        </p>
                      </div>

                      {/* ID de la orden discreto */}
                      <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                        #{order.uid.substring(4, 10).toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-1">
                      Cliente:{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-300">
                        {order.customer?.first_name} {order.customer?.last_name}
                      </span>
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/50">
                      {/* Avatares (Owner + Followers) */}
                      <div className="flex items-center gap-1.5">
                        {order.assignee ? (
                          <Avatar className="h-6 w-6 border-2 border-white dark:border-slate-900 shadow-sm">
                            <AvatarImage
                              src={order.assignee.profile?.avatar_url}
                            />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[9px] font-bold">
                              {order.assignee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div
                            className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800"
                            title="Sin asignar"
                          >
                            <AlertCircle className="h-3 w-3 text-slate-400" />
                          </div>
                        )}

                        {order.followers && order.followers.length > 0 && (
                          <div className="flex -space-x-2 overflow-hidden ml-1">
                            {order.followers
                              .slice(0, 2)
                              .map((follower: any) => (
                                <Avatar
                                  key={follower.id}
                                  className="h-5 w-5 border-2 border-white dark:border-slate-900 opacity-80"
                                >
                                  <AvatarImage
                                    src={follower.profile?.avatar_url}
                                  />
                                  <AvatarFallback className="bg-slate-200 text-slate-600 text-[8px] font-bold">
                                    {follower.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Fecha discreta */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Clock className="h-3 w-3" />
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Zona vacía atractiva si no hay órdenes en la columna */}
                {count === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl opacity-50">
                    <p className="text-xs font-medium text-slate-400">
                      Sin tareas
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

   
    </div>
  );
}
