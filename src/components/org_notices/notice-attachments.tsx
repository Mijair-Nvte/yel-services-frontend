import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoticeAttachments({ attachments }: { attachments: any[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((file) => (
        <Button key={file.id} variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          {file.name}
          <span className="text-xs text-muted-foreground">({file.size})</span>
          {file.url && <ExternalLink className="h-3 w-3 ml-1" />}
        </Button>
      ))}
    </div>
  );
}
