"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserCog, Mail, ShieldCheck } from "lucide-react";
import { AssignAreaDialog } from "@/components/shared/assign-area-dialog";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const pastelColors = [
  {
    bg: "bg-rose-50/50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: "bg-rose-100",
    hover: "hover:border-rose-400",
  },
  {
    bg: "bg-blue-50/50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: "bg-blue-100",
    hover: "hover:border-blue-400",
  },
  {
    bg: "bg-emerald-50/50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: "bg-emerald-100",
    hover: "hover:border-emerald-400",
  },
  {
    bg: "bg-purple-50/50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: "bg-purple-100",
    hover: "hover:border-purple-400",
  },
  {
    bg: "bg-amber-50/50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: "bg-amber-100",
    hover: "hover:border-amber-400",
  },
  {
    bg: "bg-cyan-50/50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    icon: "bg-cyan-100",
    hover: "hover:border-cyan-400",
  },
];

function getMemberStyle(value: string) {
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
  // 🔥 CORRECCIÓN: Como los datos vienen planos desde /directory, 'member' ya contiene todo.
  const user = member;
  const [assignOpen, setAssignOpen] = useState(false);

  // Estilo estable basado en el nombre del usuario
  const style = useMemo(
    () => getMemberStyle(user?.name || "default"),
    [user?.name],
  );

  const initials = useMemo(() => {
    return user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2);
  }, [user?.name]);

  const areaAssignments = user?.area_assignments ?? [];

  const areasMap = useMemo(() => {
    const map = new Map<string, string[]>();
    areaAssignments.forEach((assignment: any) => {
      const areaName = assignment.area?.name;
      const positionName = assignment.position?.name;
      if (!areaName || !positionName) return;
      if (!map.has(areaName)) map.set(areaName, []);
      map.get(areaName)!.push(positionName);
    });
    return map;
  }, [areaAssignments]);

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden rounded-3xl border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5",
          style.bg,
          style.hover,
        )}
      >
        {/* Decorative Top Accent */}
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-1.5 opacity-40",
            style.icon.replace("bg", "bg"),
          )}
        />

        <CardContent className="p-8 flex flex-col items-center">
          {/* Actions Menu */}
          <div className="absolute right-4 top-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-background/50"
                >
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 shadow-xl border-border/50"
              >
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

          {/* Avatar Section */}
          <div className="relative mb-6">
            <Avatar className="h-28 w-28 rounded-full ring-4 ring-white shadow-xl dark:ring-slate-900">
              {user?.avatar_url && (
                <AvatarImage src={user.avatar_url} className="object-cover" />
              )}
              <AvatarFallback
                className={cn("text-2xl font-black", style.icon, style.text)}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            {member.role === "owner" && (
              <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1.5 rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center mb-6 space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {user?.name}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{user?.email}</span>
            </div>
          </div>

          {/* Role Badge */}
          <Badge
            className={cn(
              "mb-6 font-bold uppercase tracking-widest text-[10px] px-4 py-1",
              member.role === "owner"
                ? "bg-amber-500 text-white"
                : member.role === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-600 dark:bg-slate-800",
            )}
          >
            {member.role}
          </Badge>

          {/* Areas & Positions Feed */}
          <div className="w-full space-y-4 pt-4 border-t border-border/50">
            {areasMap.size > 0 ? (
              Array.from(areasMap.entries()).map(([areaName, positions]) => (
                <div key={areaName} className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest text-center">
                    {areaName}
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {positions.map((position, index) => (
                      <span
                        key={index}
                        className="text-[11px] font-bold px-3 py-1 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-border/40 text-foreground/80 transition-transform hover:scale-105"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-2 px-4 rounded-xl border-2 border-dashed border-border/40 opacity-60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight text-center">
                  Sin departamento
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
