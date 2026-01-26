"use client";

import {
  EllipsisIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDepartmentTeam } from "@/hooks/departments/use-department-team";

export function DepartmentTeam({ departmentUid }: { departmentUid: string }) {
  const { team, loading } = useDepartmentTeam(departmentUid);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Cargando equipo…
      </div>
    );
  }

  if (team.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No hay usuarios asignados a este departamento.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {team.map((item) => {
        const user = item.user;

        return (
          <Card
            key={item.id}
            className="transition hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              {/* Left */}
              <div className="flex items-center gap-4">
                <Avatar className="ring-2 ring-ring">
                  <AvatarImage
                    src={user.avatar_url ?? undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.position_title ??
                      item.position?.name ??
                      "Sin puesto"}
                  </p>
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Ver perfil"
                >
                  <UserIcon className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Enviar mensaje"
                >
                  <MessageCircleIcon className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Más opciones"
                >
                  <EllipsisIcon className="size-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
