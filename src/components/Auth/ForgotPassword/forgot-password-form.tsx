"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, CheckCircle2, RefreshCwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const { requiresOtp, requestPasswordReset, confirmPasswordReset, cancelReset } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Estados para el reenvío del código
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Control de pasos visuales en el frontend
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Estados del formulario
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    setSubmitting(true);

    try {
      await requestPasswordReset(userEmail);
      setShowPasswordForm(false); // Aseguramos que inicie en la vista de OTP
    } catch (err: any) {
      setError(err?.message || "Error al solicitar la recuperación.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Función para reenviar el código
  const handleResendOtp = async () => {
    setError(null);
    setResendMessage(null);
    setIsResending(true);

    try {
      await requestPasswordReset(userEmail);
      setResendMessage("¡Código reenviado! Revisa tu bandeja de entrada.");
    } catch (err: any) {
      setError(err?.message || "Error al reenviar el código.");
    } finally {
      setIsResending(false);
    }
  };

  const handleContinueToPassword = () => {
    setError(null);
    setResendMessage(null);
    if (otp.length === 6) {
      setShowPasswordForm(true); // Avanza al paso de las contraseñas
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);

    try {
      // Enviamos todo al backend: el código y las contraseñas
      await confirmPasswordReset({ otp, password, password_confirmation: passwordConfirmation });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "El código es incorrecto o ha expirado.");
      setShowPasswordForm(false); // Lo regresamos a la vista del código si falla
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ VISTA 4: ÉXITO TOTAL
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold ">¡Contraseña actualizada!</h2>
        <p className="text-muted-foreground text-sm">
          Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
        </p>
        <Button className="w-full mt-4" onClick={() => router.push("/login")}>
          Ir al Inicio de Sesión
        </Button>
      </div>
    );
  }

  // ✅ VISTA 3: INGRESAR NUEVA CONTRASEÑA
  if (requiresOtp && showPasswordForm) {
    return (
      <div className="mx-auto max-w-md p-4 ">
        <CardHeader className="px-0">
          <CardTitle>Crea una nueva contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña para la cuenta <span className="font-medium">{userEmail}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="border-0 px-0">
          <form onSubmit={handleResetSubmit} className="space-y-6">
            {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md font-medium text-center">{error}</p>}

            <Field>
              <FieldLabel htmlFor="new-password">Nueva Contraseña</FieldLabel>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">Confirmar Contraseña</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </Field>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full " disabled={submitting}>
                {submitting ? "Actualizando..." : "Guardar contraseña"}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={() => setShowPasswordForm(false)}>
                Volver al código
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    );
  }

  // ✅ VISTA 2: INGRESAR CÓDIGO (OTP)
  if (requiresOtp && !showPasswordForm) {
    return (
      <div className="mx-auto max-w-md p-4">
        <CardHeader className="px-0 ">
          <CardTitle>Verifica tu código</CardTitle>
          <CardDescription>
            Ingresa el código de 6 dígitos que enviamos a <span className="font-medium">{userEmail}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="border-0 px-0">
          <div className="space-y-6">
            {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md font-medium text-center">{error}</p>}
            {resendMessage && <p className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded-md font-medium text-center">{resendMessage}</p>}

            <Field>
              <div className="flex items-center justify-between mt-3">
                <FieldLabel htmlFor="otp-verification" className="">Código de seguridad</FieldLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="xs" 
                  onClick={handleResendOtp}
                  disabled={isResending}
                >
                  <RefreshCwIcon className={cn("w-3 h-3 mr-2", isResending && "animate-spin")} />
                  {isResending ? "Enviando..." : "Reenviar código"}
                </Button>
              </div>
              <div className="flex justify-center w-full mt-2">
                <InputOTP maxLength={6} id="otp-verification" value={otp} onChange={setOtp} required>
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0}/>
                    <InputOTPSlot index={1}  />
                    <InputOTPSlot index={2}  />
                  </InputOTPGroup>
                  <InputOTPSeparator className="mx-2" />
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4}  />
                    <InputOTPSlot index={5}  />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </Field>

            <div className="flex flex-col gap-3">
              <Button 
                type="button" 
                className="w-full " 
                disabled={otp.length < 6}
                onClick={handleContinueToPassword}
              >
                Continuar
              </Button>
              <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={cancelReset}>
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  // ✅ VISTA 1: SOLICITAR CÓDIGO (Ingresar Email)
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleRequestOtp}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-white">¿Olvidaste tu contraseña?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Ingresa tu correo electrónico y te enviaremos un código para restablecerla.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center font-medium">
            <p>{error}</p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email" className="text-white">Correo electrónico</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className=""
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full " disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar código"}
          </Button>
        </Field>

        <div className="text-center mt-2">
          <Link href="/login" className="text-sm text-muted-foreground hover:underline flex items-center justify-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Volver al inicio de sesión
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}