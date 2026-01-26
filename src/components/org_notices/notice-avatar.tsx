import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function NoticeAvatar({ user }: { user: any }) {
  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
