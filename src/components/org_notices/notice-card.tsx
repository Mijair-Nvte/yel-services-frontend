"use client";

import { Bell, Pin, Eye, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { NoticeAvatar } from "./notice-avatar";
import { NoticeActions } from "./notice-actions";
import { NoticeAttachments } from "./notice-attachments";
import { priorityStyles, categoryColors } from "./notice.styles";

type NoticeLevel = keyof typeof priorityStyles;

export function NoticeCard({
  notice,
  onDelete,
  onEdit,
}: {
  notice: any;
  onDelete?: (uid: string) => void;
  onEdit?: () => void;
}) {
  const levelRaw = (notice.level ?? "normal").toLowerCase();

  const level: NoticeLevel =
    levelRaw in priorityStyles ? (levelRaw as NoticeLevel) : "normal";

  const priority = priorityStyles[level];

  const hasAttachments = notice.attachments?.length > 0;

  return (
    <Card
      className={`p-6 transition-all hover:shadow-md ${priority.border} ${
        !notice.is_active ? "opacity-60" : ""
      }`}
    >
      <CardContent className="p-0 space-y-4">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* ICON */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${priority.icon}`}
            >
              <Bell className="h-5 w-5" />
            </div>

            {/* TITLE & META */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-lg truncate">
                  {notice.title}
                </h3>

                {notice.pinned && <Pin className="h-4 w-4 text-primary" />}

                {notice.level === "urgent" && (
                  <Badge variant="outline" className={priority.badge}>
                    Urgente
                  </Badge>
                )}

                {notice.category && (
                  <Badge
                    variant="outline"
                    className={
                      categoryColors[notice.category] ??
                      categoryColors["General"]
                    }
                  >
                    {notice.category}
                  </Badge>
                )}
              </div>

              {/* AUTHOR */}
              <div className="flex items-center gap-3 mt-1">
                <NoticeAvatar user={notice.creator} />

                <div className="text-sm">
                  <p className="font-medium">
                    {notice.creator?.name}
                    {notice.creator?.position && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {notice.creator.position}
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {notice.creator?.department} ·{" "}
                    {new Date(notice.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    ·{" "}
                    {new Date(notice.created_at).toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              className={
                notice.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              }
            >
              {notice.is_active ? "Activo" : "Expirado"}
            </Badge>

            <NoticeActions
              notice={notice}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        </div>

        {/* CONTENT */}
        <p className="text-muted-foreground leading-relaxed">{notice.body}</p>

        {/* ATTACHMENTS */}
        {hasAttachments && (
          <NoticeAttachments attachments={notice.attachments} />
        )}

        {/* FOOTER */}
        <div className="flex items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
          {notice.views !== undefined && (
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{notice.views} visualizaciones</span>
            </div>
          )}

          {hasAttachments && (
            <div className="flex items-center gap-1.5">
              <Paperclip className="h-4 w-4" />
              <span>{notice.attachments.length} adjuntos</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
