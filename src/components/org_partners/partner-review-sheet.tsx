"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, User, FileText, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PartnerReviewSheetProps {
  open: boolean;
  partner: any | null;
  onClose: () => void;
  onApprove: (id: string | number) => void;
  onReject: (id: string | number) => void;
}

export function PartnerReviewSheet({
  open,
  partner,
  onClose,
  onApprove,
  onReject,
}: PartnerReviewSheetProps) {
  if (!partner) return null;

  const taxData = partner.tax_form_data || {};
  const isPending = partner.status === "pending";

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl flex items-center gap-2">
            Revisión de Solicitud
          </SheetTitle>
          <SheetDescription>
            Verifica los datos proporcionados por el afiliado.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Info de Usuario */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
              <User className="h-4 w-4" /> Datos de Contacto
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <p className="text-sm font-medium text-slate-900">
                {taxData.legal_name || partner.user?.name}
              </p>
              <p className="text-sm text-slate-500">{partner.user?.email}</p>
              <p className="text-sm text-slate-500">
                Tel: {taxData.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* Info Fiscal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
              <FileText className="h-4 w-4" /> Información Fiscal
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div>
                <p className="text-xs text-slate-500">Formulario</p>
                <Badge
                  variant="outline"
                  className="mt-1 font-mono uppercase bg-white"
                >
                  {partner.tax_form_type}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500">ID Fiscal (RFC/SSN)</p>
                <p className="text-sm font-mono font-medium mt-1 uppercase">
                  {taxData.tax_id || "NO PROPORCIONADO"}
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
              <MapPin className="h-4 w-4" /> Ubicación
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <p className="text-sm font-medium text-slate-900">
                {taxData.country} - {taxData.state}
              </p>
              <p className="text-sm text-slate-500">{taxData.address}</p>
            </div>
          </div>
        </div>

        {/* Acciones solo si está pendiente */}
        {isPending && (
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                onReject(partner.id);
                onClose();
              }}
            >
              <XCircle className="mr-2 h-4 w-4" /> Rechazar
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                onApprove(partner.id);
                onClose();
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Aprobar
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
