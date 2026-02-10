"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/services/http";

export function InviteSignupForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // validar invitación
  const [submitting, setSubmitting] = useState(false); // submit form

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔹 Validar invitación
  useEffect(() => {
    if (!token) return;

    apiFetch(`/org-invitations/${token}`)
      .then((res) => {
        setEmail(res.email);
      })
      .catch(() => {
        toast.error("Invitación inválida o expirada");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await apiFetch(`/org-invitations/${token}/accept`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          password: formData.get("password"),
          password_confirmation: formData.get("password_confirmation"),
        }),
      });

      toast.success("Cuenta creada correctamente 🎉");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.message ??
          "Ocurrió un error al crear la cuenta. Intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Cargando invitación…
      </p>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <h1 className="text-xl font-bold text-center">
              Completa tu registro
            </h1>

            {/* NOMBRE */}
            <Field>
              <FieldLabel>Nombre</FieldLabel>
              <Input name="name" required />
            </Field>

            {/* EMAIL BLOQUEADO */}
            <Field>
              <FieldLabel>Correo electrónico</FieldLabel>
              <Input value={email} disabled />
            </Field>

            {/* PASSWORD */}
            <Field>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {/* CONFIRM PASSWORD */}
            <Field>
              <div className="relative">
                <Input
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </Field>

            {/* SUBMIT */}
            <Button
              className="w-full"
              type="submit"
              disabled={submitting}
            >
              {submitting && (
                <Spinner
                  data-icon="inline-start"
                  className="mr-2"
                />
              )}
              {submitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
