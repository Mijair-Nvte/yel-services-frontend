"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

type Company = {
  uid: string;
  name: string;
  country?: string;
  description?: string;
  is_active: boolean;
};

export default function WorkspacesPage() {
  const router = useRouter();

  const { user, loading } = useAuthStore();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // 🔒 Si no hay sesión → login
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
    }
  }, [loading, user]);

  // 📦 Cargar empresas si hay sesión
  useEffect(() => {
    if (!user) return;

    const fetchCompanies = async () => {
      setLoadingCompanies(true);

      try {
        const res = await apiFetch("/org-companies");
        setCompanies(res);
      } catch {
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [user]);

  // ⏳ Loading auth
  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        Verificando sesión...
      </div>
    );
  }

  // 🚫 No render si no hay usuario
  if (!user) return null;

  // ⏳ Loading workspaces
  if (loadingCompanies) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        Cargando espacios de trabajo…
      </div>
    );
  }

  return (
    <div className="grid min-h-svh grid-cols-1 md:grid-cols-2">
      {/* LEFT */}
      <div className="relative hidden md:flex flex-col justify-between bg-primary p-10 text-primary-foreground">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            Bienvenido a YEL GROUP LLC
          </h1>
          <p className="text-primary-foreground/80 max-w-md">
            Administra tus empresas desde un solo espacio de trabajo.
          </p>
        </div>

        <div className="space-y-4 text-sm text-primary-foreground/70">
          <p>✔ Comunicación centralizada</p>
          <p>✔ Organización por departamentos</p>
          <p>✔ Plataforma interna escalable</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Espacios de trabajo</h2>

            <Button onClick={() => router.push("/workspaces/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Crear
            </Button>
          </div>

          <Separator />

          {companies.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-lg font-semibold">
                  Aún no hay espacios de trabajo
                </h3>

                <Button onClick={() => router.push("/workspaces/new")}>
                  Crear espacio de trabajo
                </Button>
              </CardContent>
            </Card>
          )}

          {companies.length > 0 && (
            <div className="grid gap-4">
              {companies.map((company) => (
                <Card
                  key={company.uid}
                  className="cursor-pointer hover:border-primary transition"
                  onClick={() => router.push(`/dashboard/${company.uid}`)}
                >
                  <CardContent className="flex justify-between p-4">
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {company.country ?? "—"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {company.description ?? "—"}
                      </p>
                    </div>

                    {!company.is_active && (
                      <span className="text-xs text-red-500">Inactiva</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
