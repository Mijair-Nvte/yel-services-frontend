import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Phone, Video, Info } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CM</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-semibold">Carlos Mendoza</h3>
          <p className="text-xs text-green-500">En línea</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}