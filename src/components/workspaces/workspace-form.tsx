"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";

type WorkspaceFormProps = {
  defaultValues?: {
    name?: string;
    country?: string;
    description?: string;
    status?: string;
  };
  mode: "create" | "edit";
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
};

export function WorkspaceForm({
  defaultValues,
  mode,
  onSubmit,
  loading,
}: WorkspaceFormProps) {
  const [form, setForm] = useState({
    name: defaultValues?.name ?? "",
    country: defaultValues?.country ?? "",
    description: defaultValues?.description ?? "",
    status: defaultValues?.status ?? "active",
  });

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <FieldGroup>
            {/* ================= INFORMACIÓN BÁSICA ================= */}
            <FieldSet>
              <FieldLegend>Información del espacio de trabajo</FieldLegend>
              <FieldDescription>
                Información general de este espacio de trabajo
              </FieldDescription>

              <FieldGroup>
                <Field>
                  <FieldLabel>Nombre del espacio de trabajo</FieldLabel>
                  <Input
                    placeholder="YEL"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>País</FieldLabel>
                  <Input
                    placeholder="Estados Unidos"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Descripción</FieldLabel>
                  <Textarea
                    placeholder="Descripción interna del espacio de trabajo"
                    className="resize-none"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* ================= ESTADO ================= */}
            <FieldSet>
              <FieldLegend>Estado</FieldLegend>
              <FieldDescription>
                Controla si este espacio de trabajo está activo
              </FieldDescription>

              <FieldGroup>
                <Field>
                  <FieldLabel>Estado</FieldLabel>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* ================= ACCIONES ================= */}
            <Field orientation="horizontal">
              <Button type="submit" disabled={loading}>
                {mode === "create"
                  ? "Crear espacio de trabajo"
                  : "Guardar cambios"}
              </Button>

              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
