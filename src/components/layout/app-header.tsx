import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAppSelector } from "@/store/hooks";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppHeader() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <div>
        <p className="text-sm font-semibold tracking-tight">ProjectFlow</p>
        <p className="text-xs text-muted-foreground">
          Enterprise Project & Task Management
        </p>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="hidden items-center gap-3 sm:flex">
            <Avatar className="size-8">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
          </div>
        ) : null}
        <LogoutButton />
      </div>
    </header>
  );
}
