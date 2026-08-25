"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, RefreshCwIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loginbg from "@/assets/logoytl.png";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";

  const { user, loading, login, requiresOtp, verifyOtp, cancelLogin } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
    setNeedsVerification(false);
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const emailStr = formData.get("email") as string;

    setUserEmail(emailStr);

    try {
      await login({
        email: emailStr,
        password: formData.get("password") as string,
      });
      // El estado requiresOtp pasará a true y mostrará la Vista 2
    } catch (err: any) {
      const errorMsg = err?.message || "Credenciales inválidas";

      if (err?.isVerificationRequired || errorMsg.toLowerCase().includes("verific")) {
        setNeedsVerification(true);
        setError(errorMsg);
        return;
      }

      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await verifyOtp(otp);
      router.replace("/workspaces");
    } catch (err: any) {
      setError(err?.message || "Código incorrecto o expirado");
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

  // ==========================================
  // VISTA 2: FORMULARIO DE VERIFICACIÓN OTP
  // ==========================================
  if (requiresOtp) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8 flex flex-col justify-center" onSubmit={handleOtpSubmit}>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-2xl font-bold">Verifica tu inicio de sesión</h1>
                <p className="text-muted-foreground text-sm">
                  Ingresa el código de 6 dígitos que enviamos a tu correo:{" "}
                  <span className="font-medium text-foreground">{userEmail}</span>.
                </p>
              </div>

              <FieldGroup>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Field>
                  <div className="flex items-center justify-between mb-2">
                    <FieldLabel htmlFor="otp-verification">Código de seguridad</FieldLabel>
                    <Button variant="ghost" size="xs" type="button" className="h-6 px-2 text-xs">
                      <RefreshCwIcon className="w-3 h-3 mr-1" />
                      Reenviar
                    </Button>
                  </div>
                  <div className="flex justify-center w-full">
                    <InputOTP maxLength={6} id="otp-verification" value={otp} onChange={setOtp} required>
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="mx-2" />
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </Field>

                <div className="flex flex-col gap-3 mt-4">
                  <Button type="submit" className="w-full" disabled={submitting || otp.length < 6}>
                    {submitting ? "Verificando..." : "Verificar y Entrar"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={cancelLogin}>
                    Regresar
                  </Button>
                </div>
              </FieldGroup>
            </form>

          <div className="relative hidden md:flex items-center justify-center">
            <Image
              src={Loginbg}
              alt="Login background"
              className="dark:brightness-[0.25]"
              priority
            />
          </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // VISTA 1: FORMULARIO NORMAL (EMAIL/PASS)
  // ==========================================
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <form className="p-6 md:p-8 flex flex-col justify-center" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
              </div>

              {/* Mensaje de Éxito de Verificación */}
              {isVerified && !error && (
                <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm p-3 rounded-md flex items-center justify-center gap-2 font-medium text-center">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>¡Cuenta verificada! Ya puedes iniciar sesión.</p>
                </div>
              )}

              {/* Error y Link de Verificación Pendiente */}
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center font-medium">
                  <p>{error}</p>
                  {needsVerification && (
                    <Link
                      href="/auth/verify-email"
                      className="inline-block mt-2 font-bold underline hover:text-destructive/80"
                    >
                      Verificar cuenta ahora
                    </Link>
                  )}
                </div>
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
                    href="/forgot-password"
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
            </FieldGroup>
          </form>

          {/* Imagen de fondo (Lado Derecho) */}
          <div className="relative border-l-1 hidden md:flex items-center justify-center">
            <Image
              src={Loginbg}
              alt="Login background"
              className="dark:brightness-[0.25]"
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}