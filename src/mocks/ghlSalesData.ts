// src/mocks/ghlSalesData.ts

export type SalespersonStatus = "pending" | "paid" | "not_applicable";

export interface SaleRecord {
  // Datos originales de GHL (vienen de image_1.png e image_3.png)
  ghl_order_id: string; // Internal Order Id: 69c7122...
  customer_name: string;
  customer_initials: string;
  source_name: string; // YOMARLIS | Crea tu LLC
  items: string; // 1 Item
  order_date: string;
  amount: number;
  order_status: "Completed" | "Unfulfilled";

  // Datos técnicos de rastreo (vienen de image_3.png)
  transaction_id: string; // Transaction ID: 69c7122...
  payment_link_ghl_id: string | null; // Id: 698cfc8e5... (El ID crítico para el mapeo)

  // Lógica de Negocio (Campos calculados/guardados en TU Laravel)
  is_commissionable: boolean; // ¿Viene de link de pago y no de store?
  seller_name: string | null; // Yomarlis, Francisco, etc.
  commission_8_amount: number; // 8% de comisión
  commission_status: SalespersonStatus; // Estado de pago de comisión (Tu control)
}

export const MOCK_GHL_SALES: SaleRecord[] = [
  {
    // Datos basados en la primera fila de image_1.png y detalle de image_3.png
    ghl_order_id: "69c7122833f88f93d56bd7d4", // De image_3.png
    customer_name: "Luis Leyva",
    customer_initials: "LL",
    source_name: "YOMARLIS | Crea tu LLC",
    items: "1 Item",
    order_date: "Mar 24 at 06:14 PM",
    amount: 1200.00,
    order_status: "Completed",
    transaction_id: "69c712299ce990062a7c4d94", // De image_3.png
    payment_link_ghl_id: "698cfc8e5a761e70000fb3a4", // ID crítico para el mapeo de Yomarlis
    is_commissionable: true,
    seller_name: "Yomarlis",
    commission_8_amount: 96.00, // 1200 * 0.08
    commission_status: "pending", // Por defecto cuando llega
  },
  {
    // Datos basados en la segunda fila de image_1.png
    ghl_order_id: "ord_juan_esparza",
    customer_name: "JUAN ESPARZA",
    customer_initials: "JE",
    source_name: "FRANCISCO | Crea tu LLC",
    items: "1 Item",
    order_date: "Mar 23 at 04:49 PM",
    amount: 1200.00,
    order_status: "Completed",
    transaction_id: "txn_juan_esparza",
    payment_link_ghl_id: "698cfcc39577be54d1b3d8dc", // ID mapeado a Francisco en tu Excel (image_4.png)
    is_commissionable: true,
    seller_name: "Francisco",
    commission_8_amount: 96.00,
    commission_status: "paid", // Simulamos que ya se pagó
  },
  {
    // Datos basados en la última fila de image_1.png (Venta de Tienda, NO COMISIONABLE)
    ghl_order_id: "ord_jose_fernandez",
    customer_name: "Jose Fernandez",
    customer_initials: "JF",
    source_name: "Yel Services Store", // Identificador de la tienda
    items: "1 Item",
    order_date: "Mar 10 at 06:32 PM",
    amount: 600.00,
    order_status: "Unfulfilled",
    transaction_id: "txn_jose_fernandez",
    payment_link_ghl_id: null, // No aplica ID de link de pago
    is_commissionable: false,
    seller_name: null,
    commission_8_amount: 0.00,
    commission_status: "not_applicable",
  },
];