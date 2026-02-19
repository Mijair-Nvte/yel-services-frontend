"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserCog } from "lucide-react";
import { AssignAreaDialog } from "@/components/shared/assign-area-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/**
 * 🎨 Paleta pastel elegante
 */
const pastelColors = [
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
];

/**
 * 🔢 Generar color estable basado en string
 */
function getPastelColor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pastelColors.length;
  return pastelColors[index];
}

export function TeamCard({
  member,
  workspaceUid,
  reloadTeam,
}: {
  member: any;
  workspaceUid: string;
  reloadTeam: () => void;
}) {
  const user = member.user;
  const [assignOpen, setAssignOpen] = useState(false);

  const initials = useMemo(() => {
    return user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2);
  }, [user?.name]);

  const areaAssignments = user?.area_assignments ?? [];

  /**
   * Agrupar áreas
   */
  const areasMap = useMemo(() => {
    const map = new Map<string, string[]>();

    areaAssignments.forEach((assignment: any) => {
      const areaName = assignment.area?.name;
      const positionName = assignment.position?.name;

      if (!areaName || !positionName) return;

      if (!map.has(areaName)) {
        map.set(areaName, []);
      }

      map.get(areaName)!.push(positionName);
    });

    return map;
  }, [areaAssignments]);

  return (
    <>
      <Card className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardContent className="p-6 flex flex-col items-center text-center space-y-6">
          {/* Actions */}
          <div className="absolute right-4 top-4 opacity-70 hover:opacity-100 transition">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setAssignOpen(true);
                  }}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Asignar área
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Avatar */}
          <Avatar className="h-24 w-24 rounded-full ring-4 ring-background shadow-md">
            {user?.avatar_url && (
              <AvatarImage src={user.avatar_url} className="object-cover" />
            )}

            <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              {user?.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>

          {/* Areas */}
          {/* Areas */}
          <div className="w-full space-y-4">
            {areasMap.size > 0 ? (
              Array.from(areasMap.entries()).map(([areaName, positions]) => (
                <div
                  key={areaName}
                  className="flex flex-col items-center space-y-2"
                >
                  {/* Area name */}
                  <div className="text-sm font-semibold tracking-wide">
                    {areaName}
                  </div>

                  {/* Positions */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {positions.map((position, index) => (
                      <span
                        key={index}
                        className={`text-xs px-3 py-1 rounded-full border ${getPastelColor(
                          position,
                        )}`}
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Sin departamento asignado
                </p>
              </div>
            )}
          </div>

          {/* Company Role */}
          <Badge
            className={
              member.role === "owner"
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : member.role === "admin"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-muted text-muted-foreground"
            }
          >
            {member.role}
          </Badge>
        </CardContent>
      </Card>

      {/* Dialog */}
      <AssignAreaDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        workspaceUid={workspaceUid}
        userId={user.id}
        onSuccess={reloadTeam}
      />
    </>
  );
}
