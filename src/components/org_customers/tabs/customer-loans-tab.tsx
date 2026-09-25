import { useState, useEffect } from "react";
import { FileText, Loader2, CalendarDays, DollarSign, MapPin, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrgCustomerService } from "@/services/org-customer/org-customer.service";
import { toast } from "sonner";

export function CustomerLoansTab({ workspaceUid, customerUid, customerName }: { workspaceUid: string, customerUid: string, customerName: string }) {
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await OrgCustomerService.getLoans(workspaceUid, customerUid);
        setLoans(data || []);
      } catch (error) {
        toast.error("Error al cargar los préstamos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, [workspaceUid, customerUid]);

  // Función auxiliar para colorear los estatus
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "open" || s === "pending") return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    if (s === "won" || s === "approved") return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
    if (s === "lost" || s === "rejected") return "bg-red-100 text-red-700 hover:bg-red-200";
    return "bg-slate-100 text-slate-700 hover:bg-slate-200";
  };

  return (
    <Card className="shadow-sm border-slate-200/60">
      <CardHeader>
        <CardTitle>Historial de Préstamos</CardTitle>
        <CardDescription>Solicitudes de financiamiento asociadas a {customerName}.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
        ) : loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <FileText className="h-10 w-10 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay préstamos</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">Este cliente aún no tiene solicitudes de préstamo registradas.</p>
            <Button variant="outline">Asignar Préstamo</Button>
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium text-slate-500">Tipo de Préstamo</th>
                  <th className="p-4 font-medium text-slate-500">Monto Estimado</th>
                  <th className="p-4 font-medium text-slate-500">Estado (Ubicación)</th>
                  <th className="p-4 font-medium text-slate-500">Fecha de Solicitud</th>
                  <th className="p-4 font-medium text-slate-500">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loans.map((loan) => (
                  <tr key={loan.uid} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <CreditCard className="h-4 w-4 text-indigo-500" />
                        {loan.loan_type || "No especificado"}
                      </div>
                      {loan.notes && (
                        <div className="text-xs text-slate-500 mt-1 max-w-[200px] truncate" title={loan.notes}>
                          {loan.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                        <DollarSign className="h-4 w-4" />
                        {loan.estimated_amount 
                          ? new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(loan.estimated_amount)
                          : "0.00"}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {loan.applicant_state || "N/A"}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(loan.created_at).toLocaleDateString("es-MX", { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className={getStatusBadge(loan.status)}
                      >
                        {loan.status || "Pendiente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}