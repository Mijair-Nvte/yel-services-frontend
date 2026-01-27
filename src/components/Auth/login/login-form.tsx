"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loginbg from "@/app/assets/loginbg.png";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const { user, loading, login } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Redirigir automáticamente si ya hay sesión activa
  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/workspaces");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      await login(payload);

      router.replace("/workspaces");
    } catch (err: any) {
      setError(err?.message || "Credenciales inválidas");
    } finally {
      setSubmitting(false);
    }
  };

  // ⏳ Mientras carga auth, no renderizar formulario
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        Cargando sesión...
      </div>
    );
  }

  // 🚫 Si ya hay sesión, no mostrar login
  if (user) return null;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-muted-foreground">
                  Inicia sesión en tu cuenta
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>

                  <Link
                    href="#"
                    className="ml-auto text-sm text-muted-foreground hover:underline"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                O continuar con
              </FieldSeparator>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  Apple
                </Button>
                <Button variant="outline" type="button">
                  Google
                </Button>
                <Button variant="outline" type="button">
                  Meta
                </Button>
              </div>
            </FieldGroup>
          </form>

          <div className="relative hidden md:block">
            <Image
              src={Loginbg}
              alt="Login background"
              fill
              className="object-cover dark:brightness-[0.25]"
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
