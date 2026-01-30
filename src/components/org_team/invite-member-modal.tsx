"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartments } from "@/hooks/departments/use-departments";

import { useOrgInvitations } from "@/hooks/org_team/use-org-invitations";

export function InviteMemberModal({ workspaceUid }: { workspaceUid: string }) {
  const { inviteMember, loading } = useOrgInvitations(workspaceUid);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [open, setOpen] = useState(false);

  const { departments, loading: loadingDepartments } =
    useDepartments(workspaceUid);

  const [departmentId, setDepartmentId] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!email) return;

    try {
      await inviteMember(email, role, departmentId); // ✅ ahora sí

      alert("Invitación enviada correctamente ✅");

      setEmail("");
      setRole("member");
      setDepartmentId(null); // ✅ reset también
      setOpen(false);
    } catch (err: any) {
      alert(err?.message ?? "Error al invitar usuario");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invitar miembro</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar a un miembro</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email */}
          <Input
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Role */}
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona rol" />
            </SelectTrigger>

            <SelectContent className="w-full">
              <SelectItem value="member">Miembro</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={departmentId ?? ""}
            onValueChange={(val) => setDepartmentId(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Asignar departamento (opcional)" />
            </SelectTrigger>

            <SelectContent className="w-full">
              {departments.map((dep) => (
                <SelectItem key={dep.id} value={String(dep.id)}>
                  {dep.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Button */}
          <Button className="w-full" onClick={handleInvite} disabled={loading}>
            {loading ? "Enviando..." : "Enviar invitación"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
