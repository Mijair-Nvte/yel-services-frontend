"use client";

import React, { useState, useEffect } from 'react';
import { useCompanySettings } from '@/hooks/org_company_settings/useCompanySettings';
import { OrgUserService } from '@/services/org_settings/users/org-user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bell, Webhook, Loader2, Save, Users } from 'lucide-react';

interface User {
  id: number;
  name: string;
}

interface LoanSettings {
  notifications: {
    notify_on_new_loan: boolean;
    push_notifications_enabled: boolean;
    assigned_users_to_notify: number[];
  };
  integrations: {
    gohighlevel_webhook_url: string;
    webhook_active: boolean;
  };
}

const defaultLoanSettings: LoanSettings = {
  notifications: {
    notify_on_new_loan: false,
    push_notifications_enabled: false,
    assigned_users_to_notify: [],
  },
  integrations: {
    gohighlevel_webhook_url: '',
    webhook_active: false,
  },
};

interface LoansTabProps {
  workspaceUid: string;
}

export default function LoansTab({ workspaceUid }: LoansTabProps) {
  const {
    settings,
    setSettings,
    isLoading,
    isSaving,
    error,
    saveSettings,
  } = useCompanySettings<LoanSettings>(workspaceUid, 'loans', defaultLoanSettings);

  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!workspaceUid) {
        setLoadingUsers(false);
        return;
      }
      
      setLoadingUsers(true);
      try {
        const response = await OrgUserService.getAll(workspaceUid);
        const rawMembers = Array.isArray(response) ? response : (response.data || []);

        const filteredUsers = rawMembers
          .map((member: any) => {
            const role = member.role?.toLowerCase() || '';
            if (role === 'owner' || role === 'admin' || role === 'member' || !role.includes('partner')) {
              return {
                id: member.user?.id || member.id,
                name: member.user?.name || 'Usuario',
              };
            }
            return null;
          })
          .filter(Boolean) as User[];

        setCompanyUsers(filteredUsers);
      } catch (err) {
        console.error("❌ Error al cargar usuarios:", err);
        setCompanyUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [workspaceUid]);

  const handleUserToggle = (userId: number) => {
    setSettings((prev) => {
      const currentUsers = prev.notifications.assigned_users_to_notify;
      const newUsers = currentUsers.includes(userId)
        ? currentUsers.filter((id) => id !== userId)
        : [...currentUsers, userId];

      return {
        ...prev,
        notifications: { ...prev.notifications, assigned_users_to_notify: newUsers },
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Cargando configuración de préstamos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-destructive bg-destructive/10 rounded-lg border border-destructive/20 text-sm">
        {error}
      </div>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          Configuración de Préstamos
        </CardTitle>
        <CardDescription>
          Administra las alertas automáticas y conexiones externas para los registros de préstamos.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* --- SECCIÓN NOTIFICACIONES --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base">Notificaciones Internas</h3>
          </div>
          
          <div className="grid gap-4 pl-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="notify_new_loan"
                checked={settings.notifications.notify_on_new_loan}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, notify_on_new_loan: checked === true }
                  })
                }
              />
              <Label htmlFor="notify_new_loan" className="text-sm font-normal cursor-pointer leading-none">
                Notificar al equipo cuando ingrese un nuevo préstamo
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="push_notifications"
                checked={settings.notifications.push_notifications_enabled}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push_notifications_enabled: checked === true }
                  })
                }
              />
              <Label htmlFor="push_notifications" className="text-sm font-normal cursor-pointer leading-none">
                Enviar notificación Push (si está disponible)
              </Label>
            </div>

            {/* Selector múltiple de usuarios */}
            {settings.notifications.notify_on_new_loan && (
              <div className="mt-4 p-4 bg-muted/40 rounded-lg border space-y-3 animate-in fade-in-50">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Selecciona quiénes recibirán la alerta:</span>
                </div>
                
                {loadingUsers ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Cargando directorio de usuarios...</span>
                  </div>
                ) : companyUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No se encontraron usuarios administrativos disponibles.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {companyUsers.map((user) => {
                      const isChecked = settings.notifications.assigned_users_to_notify.includes(user.id);
                      return (
                        <div 
                          key={user.id} 
                          onClick={() => handleUserToggle(user.id)}
                          className={`flex items-center space-x-3 p-2.5 rounded-md border bg-card cursor-pointer transition-colors hover:bg-accent/50 ${
                            isChecked ? 'border-primary/50 bg-primary/5' : 'border-border'
                          }`}
                        >
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={isChecked}
                            onCheckedChange={() => handleUserToggle(user.id)}
                          />
                          <Label htmlFor={`user-${user.id}`} className="text-sm cursor-pointer truncate font-medium">
                            {user.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* --- SECCIÓN INTEGRACIONES / GOHIGHLEVEL --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Webhook className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base">Integraciones (GoHighLevel)</h3>
          </div>
          
          <div className="grid gap-4 pl-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="webhook_active"
                checked={settings.integrations.webhook_active}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    integrations: { ...settings.integrations, webhook_active: checked === true }
                  })
                }
              />
              <Label htmlFor="webhook_active" className="text-sm font-normal cursor-pointer leading-none">
                Activar Webhook al crear un préstamo
              </Label>
            </div>

            {settings.integrations.webhook_active && (
              <div className="space-y-2 pt-2 animate-in fade-in-50">
                <Label htmlFor="webhook_url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  URL del Webhook (GHL Inbound Webhook)
                </Label>
                <Input
                  id="webhook_url"
                  type="text"
                  placeholder="https://services.leadconnectorhq.com/hooks/..."
                  value={settings.integrations.gohighlevel_webhook_url}
                  onChange={(e) => setSettings({
                    ...settings,
                    integrations: { ...settings.integrations, gohighlevel_webhook_url: e.target.value }
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Esta URL recibirá un POST con los datos del préstamo para detonar workflows de automatización.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end border-t bg-muted/20 py-4 px-6">
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Guardar Configuración</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}