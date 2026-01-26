"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Integrationimg from "@/app/assets/integrations.jpg";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      password_confirmation: formData.get("password_confirmation") as string,
    };

    try {
      const res = await AuthService.register(payload);

      localStorage.setItem("auth_token", res.token);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      // aquí luego puedes mostrar errores de validación
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Crea tu cuenta
                </h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Ingresa tus datos para crear tu cuenta
                </p>
              </div>

              {/* NOMBRE */}
              <Field>
                <FieldLabel htmlFor="name">
                  Nombre
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Mijair"
                  required
                />
              </Field>

              {/* EMAIL */}
              <Field>
                <FieldLabel htmlFor="email">
                  Correo electrónico
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </Field>

              {/* CONTRASEÑAS */}
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">
                      Contraseña
                    </FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password_confirmation">
                      Confirmar
                    </FieldLabel>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      required
                    />
                  </Field>
                </div>
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Crear cuenta
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

              <FieldDescription className="text-center">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Inicia sesión
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src={Integrationimg}
              alt="Imagen de integraciones"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
