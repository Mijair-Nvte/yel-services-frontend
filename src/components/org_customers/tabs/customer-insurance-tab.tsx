import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, CalendarDays, MapPin, User, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrgCustomerService } from "@/services/org-customer/org-customer.service";
import { toast } from "sonner";

export function CustomerInsuranceTab({ workspaceUid, customerUid, customerName }: { workspaceUid: string, customerUid: string, customerName: string }) {
  const [insurances, setInsurances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const data = await OrgCustomerService.getInsurances(workspaceUid, customerUid);
        setInsurances(data || []);
      } catch (error) {
        toast.error("Error al cargar los seguros.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsurances();
  }, [workspaceUid, customerUid]);

  // Función para darle color a los estados de la póliza/solicitud
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "open" || s === "pending") return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    if (s === "won" || s === "approved") return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
    if (s === "lost" || s === "rejected") return "bg-red-100 text-red-700 hover:bg-red-200";
    return "bg-slate-100 text-slate-700 hover:bg-slate-200";
  };

  // Capitaliza la primera letra del tipo de seguro (ej: "general" -> "General")
  const formatInsuranceType = (type: string) => {
    if (!type) return "No especificado";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="shadow-sm border-slate-200/60">
      <CardHeader>
        <CardTitle>Pólizas de Seguro</CardTitle>
        <CardDescription>Seguros contratados o en proceso por {customerName}.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
        ) : insurances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <ShieldCheck className="h-10 w-10 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay seguros</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">Este cliente no cuenta con aplicaciones de seguro registradas.</p>
            <Button variant="outline">Crear Póliza</Button>
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium text-slate-500">Tipo de Seguro</th>
                  <th className="p-4 font-medium text-slate-500">Beneficiario / Solicitante</th>
                  <th className="p-4 font-medium text-slate-500">Ubicación</th>
                  <th className="p-4 font-medium text-slate-500">Fecha de Solicitud</th>
                  <th className="p-4 font-medium text-slate-500">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {insurances.map((ins) => (
                  <tr key={ins.uid} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <ShieldCheck className="h-4 w-4 text-indigo-500" />
                        {formatInsuranceType(ins.insurance_type)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">
                        {ins.uid.split('_')[1] || ins.uid}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <User className="h-4 w-4 text-slate-400" />
                        {ins.applicant_name || "No especificado"}
                      </div>
                      {ins.applicant_dob && (
                        <div className="text-xs text-slate-500 mt-1 ml-6">
                          Nacimiento: {new Date(ins.applicant_dob).toLocaleDateString("es-MX", { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {ins.applicant_state || "N/A"}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(ins.created_at).toLocaleDateString("es-MX", { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge 
                          variant="secondary" 
                          className={getStatusBadge(ins.status)}
                        >
                          {ins.status || "Pendiente"}
                        </Badge>
                        {ins.status?.toLowerCase() === 'won' && ins.commission_status === 'paid' && (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Comisión pagada
                          </div>
                        )}
                      </div>
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