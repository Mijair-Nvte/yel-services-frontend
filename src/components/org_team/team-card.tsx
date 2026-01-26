"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export function TeamCard({ member }: { member: any }) {
  const user = member.user;

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  const areaAssignments = user?.area_assignments ?? [];

  /**
   * 🧠 Agrupar por área
   * {
   *   "YEL MKT": ["Developer", "Lead"]
   * }
   */
  const areasMap = new Map<string, string[]>();

  areaAssignments.forEach((assignment: any) => {
    const areaName = assignment.area?.name;
    const positionName = assignment.position?.name;

    if (!areaName || !positionName) return;

    if (!areasMap.has(areaName)) {
      areasMap.set(areaName, []);
    }

    areasMap.get(areaName)!.push(positionName);
  });

  /**
   * 🎭 Puestos únicos (para mostrar arriba)
   */
  const uniquePositions = Array.from(
    new Set(
      areaAssignments
        .map((a: any) => a.position?.name)
        .filter(Boolean)
    )
  );

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>

        
        </div>

        {/* Areas + Positions */}
        <div className="flex flex-wrap justify-center gap-2">
          {areasMap.size > 0 ? (
            Array.from(areasMap.entries()).map(
              ([areaName, positions]) => (
                <Badge
                  key={areaName}
                  variant="secondary"
                  className="text-xs px-3 py-1"
                >
                  {areaName}
                  <span className="ml-1 text-muted-foreground">
                    ({positions.join(", ")})
                  </span>
                </Badge>
              )
            )
          ) : (
            <span className="text-xs text-muted-foreground">
              Sin departamento asignado
            </span>
          )}
        </div>

        {/* Company Role */}
        <Badge
          className={
            member.role === "owner"
              ? "bg-amber-100 text-amber-700"
              : member.role === "admin"
              ? "bg-blue-100 text-blue-700"
              : "bg-muted text-muted-foreground"
          }
        >
          {member.role}
        </Badge>

        {/* Actions */}
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
