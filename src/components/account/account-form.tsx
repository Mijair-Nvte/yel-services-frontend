"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "@/hooks/account/use-account";
import { AccountService } from "@/services/account/account.service";
import { toast } from "sonner";

export function AccountForm() {
  const { profile, loading, update, reload } = useAccount();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    country: "",
    state: "",
    city: "",
  });

  const [originalForm, setOriginalForm] = useState(form);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // ==============================
  // LOAD PROFILE DATA
  // ==============================
  useEffect(() => {
    if (profile?.profile) {
      const data = {
        first_name: profile.profile.first_name ?? "",
        last_name: profile.profile.last_name ?? "",
        phone: profile.profile.phone ?? "",
        country: profile.profile.country ?? "",
        state: profile.profile.state ?? "",
        city: profile.profile.city ?? "",
      };

      setForm(data);
      setOriginalForm(data);

      if (profile.profile.avatar_url) {
        setAvatarPreview(profile.profile.avatar_url);
      }
    }
  }, [profile]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Detectar cambios
  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  }, [form, originalForm]);

  // ==============================
  // SAVE PROFILE
  // ==============================
  const handleSubmit = async () => {
    if (!isDirty) return;

    try {
      setSaving(true);

      await update(form);

      setOriginalForm(form);

      toast.success("Perfil actualizado correctamente ✨");
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // AVATAR UPLOAD
  // ==============================
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("El archivo supera los 2MB permitidos.");
      return;
    }

    // preview temporal
    setAvatarPreview(URL.createObjectURL(file));

    try {
      const res = await AccountService.uploadAvatar(file);

      // 🔥 usar avatar_url que viene del backend
      if (res.avatar_url) {
        setAvatarPreview(res.avatar_url);
      }

      toast.success("Avatar actualizado correctamente 🖼️");
    } catch {
      toast.error("Error al subir el avatar.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 w-20 rounded-full bg-muted" />
        <div className="h-4 w-1/3 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AVATAR */}
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20 overflow-hidden rounded-full">
          <AvatarImage
            src={avatarPreview ?? undefined}
            className="h-full w-full object-cover"
          />
          <AvatarFallback>
            {form.first_name?.[0]}
            {form.last_name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div>
          <label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">Cambiar avatar</span>
            </Button>
          </label>

          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG o WEBP. Máx 2MB.
          </p>
        </div>
      </div>

      <Separator />

      {/* PERSONAL INFO */}
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <Input
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <Input
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* LOCATION */}
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Input
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Input
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isDirty || saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
