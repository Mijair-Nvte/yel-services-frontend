"use client";

import { Bell, Pin, Eye, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { NoticeAvatar } from "./notice-avatar";
import { NoticeActions } from "./notice-actions";
import { NoticeAttachments } from "./notice-attachments";
import { NoticeDetailDialog } from "./notice-detail-dialog";

export function NoticeCard({
  notice,
  onDelete,
  onEdit,
  onTogglePin,
}: {
  notice: any;
  onDelete?: (uid: string) => void;
  onEdit?: () => void;
  onTogglePin?: () => void;
}) {
  const level = notice.level;

  const levelColor = level?.color ?? "#64748B";
  const levelName = level?.name ?? "Sin nivel";

  const hasAttachments = notice.attachments?.length > 0;

  const preview =
    notice.body.length > 270
      ? notice.body.slice(0, 280) + "..."
      : notice.body;

  return (
    <Card
      className={`p-6 transition-all duration-300 hover:shadow-xl ${
        !notice.is_active ? "opacity-60" : ""
      }`}
      style={{
        borderLeft: `6px solid ${levelColor}`,

        // ✅ Glow elegante
        boxShadow: `0 0 0px transparent`,

        // Glow suave base
        background: `linear-gradient(90deg, ${levelColor}10, transparent 60%)`,
      }}
    >
      <CardContent className="p-0 space-y-4">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* ICON dinámico */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{
                backgroundColor: levelColor,

                // Glow icon
                boxShadow: `0 0 18px ${levelColor}55`,
              }}
            >
              <Bell className="h-5 w-5" />
            </div>

            {/* TITLE & META */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-lg truncate">
                  {notice.title}
                </h3>

                {/* PIN */}
                {notice.is_pinned && (
                  <Pin className="h-4 w-4 text-primary" />
                )}

                {/* NIVEL dinámico */}
                {notice.level && (
                  <Badge
                    className="text-white border-none px-3 py-1 rounded-full shadow-sm"
                    style={{
                      backgroundColor: levelColor,
                      boxShadow: `0 0 10px ${levelColor}55`,
                    }}
                  >
                    {levelName}
                  </Badge>
                )}
              </div>

              {/* AUTHOR */}
              <div className="flex items-center gap-3 mt-1">
                <NoticeAvatar user={notice.creator} />

                <div className="text-sm">
                  <p className="font-medium">{notice.creator?.name}</p>

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
            <NoticeActions
              notice={notice}
              onDelete={onDelete}
              onEdit={onEdit}
              onTogglePin={onTogglePin}
            />
          </div>
        </div>

        {/* BODY */}
        <div>
          <p className="text-muted-foreground leading-relaxed">{preview}</p>

          {/* VER MÁS */}
          {notice.body.length > 140 && (
            <NoticeDetailDialog notice={notice}>
              <button className="text-sm text-primary hover:underline mt-2">
                Ver más →
              </button>
            </NoticeDetailDialog>
          )}
        </div>

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
