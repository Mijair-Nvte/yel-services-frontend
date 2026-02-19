"use client";

import { TeamCard } from "./team-card";

export function TeamGrid({
  members,
  workspaceUid,
  reload,
}: {
  members: any[];
  workspaceUid: string;
  reload: () => void;
}) {
  if (!members || members.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No hay miembros en el equipo.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member) => (
        <TeamCard
          key={member.id}
          member={member}
          workspaceUid={workspaceUid}
          reloadTeam={reload}
        />
      ))}
    </div>
  );
}
