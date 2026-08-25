import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import logoyelpro from "@/assets/logoytl.png";

import { ForgotPasswordForm } from "@/components/Auth/ForgotPassword/forgot-password-form";


export const metadata = {
  title: "Recuperar Contraseña — YEL Pro",
  description: "Restablece el acceso a tu cuenta en YEL Pro.",
};

export default function ForgotPasswordPage() {
  return (
 <div className="flex min-h-svh w-full items-center justify-center  ">
      <div className="w-full max-w-sm">
        <Card className="p-6">
          <div className="mx-auto w-full max-w-sm py-6">
            <div className="flex justify-center mb-6">
              <Image
                src={logoyelpro}
                alt="Yel Pro"
                width={190}
                height={90}
                priority
              />
            </div>
            <Suspense
              fallback={
                <div className="text-center p-4">Cargando formulario...</div>
              }
            >
              <ForgotPasswordForm />
            </Suspense>
          </div>
        </Card>
      </div>
    </div>
  );
}
