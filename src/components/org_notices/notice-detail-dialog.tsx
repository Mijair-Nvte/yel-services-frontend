"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { NoticeAvatar } from "./notice-avatar";
import { NoticeAttachments } from "./notice-attachments";

import { Eye, Paperclip } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

export function NoticeDetailDialog({
  notice,
  children,
}: {
  notice: any;
  children: React.ReactNode;
}) {
  const hasAttachments = notice.attachments?.length > 0;

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* Modal */}
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {notice.title}

            {notice.is_pinned && (
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                📌 Fijado
              </Badge>
            )}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Publicado el{" "}
            {new Date(notice.created_at).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        {/* Autor */}
        <div className="flex items-center gap-3 mt-4">
          <NoticeAvatar user={notice.creator} />
          <div>
            <p className="font-medium">{notice.creator?.name}</p>
            <p className="text-xs text-muted-foreground">
              {notice.creator?.department}
            </p>
          </div>
        </div>

        {/* Texto completo */}
        <div className="mt-6 whitespace-pre-line text-base leading-relaxed">
          {notice.body}
        </div>

        {/* Adjuntos */}
        {hasAttachments && (
          <div className="mt-6">
            <NoticeAttachments attachments={notice.attachments} />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 text-sm text-muted-foreground border-t pt-4">
          {notice.views !== undefined && (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {notice.views} visualizaciones
            </div>
          )}

          {hasAttachments && (
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              {notice.attachments.length} adjuntos
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button >Cerrar</Button>
            </DialogClose>
            
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
