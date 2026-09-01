"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { OrgUserService } from "@/services/org_settings/users/org-user.service";
import { OrgPartnerAdminService } from "@/services/org_partners/org-partner-admin.service";

interface Props {
  onAssigned: () => void; // Para recargar la tabla principal al terminar
}

export function AssignInternalPartnerModal({ onAssigned }: Props) {
  const { workspaceUid } = useParams<{ workspaceUid: string }>();
  const [open, setOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // Cargar el directorio cuando se abre el modal
  useEffect(() => {
    if (open && workspaceUid) {
      fetchDirectory();
    }
  }, [open, workspaceUid]);

  const fetchDirectory = async () => {
    setLoadingUsers(true);
    try {
      const res = await OrgUserService.getDirectory(workspaceUid);
      // Dependiendo de cómo devuelva la respuesta tu backend (res.data o directo el array)
      setUsers(res.data || res || []);
    } catch (error) {
      toast.error("Error al cargar el directorio de la empresa.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectUser = async (userId: number | string) => {
    setSubmitting(true);
    try {
      await OrgPartnerAdminService.assignInternal(workspaceUid, userId);
      toast.success("Vendedor interno asignado exitosamente.");
      setOpen(false);
      onAssigned(); // Recargamos la lista de la página principal
    } catch (error: any) {
      toast.error(error.message || "Error al asignar como vendedor interno.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Botón principal para abrir el modal */}
      <Button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Convertir Usuario a Vendedor Interno
      </Button>

      {/* Command Dialog de Shadcn UI */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar empleado por nombre o email..." />
        <CommandList>
          <CommandEmpty>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-6 gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                Cargando miembros de la empresa...
              </div>
            ) : (
              "No se encontraron usuarios."
            )}
          </CommandEmpty>

          <CommandGroup heading="Miembros de la empresa">
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={`${user.name} ${user.email}`}
                onSelect={() => handleSelectUser(user.id)}
                disabled={submitting}
                className="cursor-pointer flex items-center justify-between py-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                {submitting && <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}