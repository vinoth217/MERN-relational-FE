import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  ListTodo,
  Shield,
  Users,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
  );

export function AppSidebar() {
  const location = useLocation();
  const role = useAppSelector((state) => state.auth.user?.role);
  const isAdmin = role === "ADMIN";
  const isUsersRolesSection =
    location.pathname.startsWith("/users") ||
    location.pathname.startsWith("/roles");
  const [usersRolesOpen, setUsersRolesOpen] = useState(isUsersRolesSection);

  useEffect(() => {
    if (isUsersRolesSection) {
      setUsersRolesOpen(true);
    }
  }, [isUsersRolesSection]);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <LayoutDashboard className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">ProjectFlow</p>
          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <NavLink to="/dashboard" className={navLinkClass} end>
          <LayoutDashboard className="size-4" />
          Dashboard
        </NavLink>

        <NavLink to="/projects" className={navLinkClass}>
          <FolderKanban className="size-4" />
          Projects
        </NavLink>

        <NavLink to="/tasks" className={navLinkClass}>
          <ListTodo className="size-4" />
          Tasks
        </NavLink>

        <NavLink to="/hierarchy" className={navLinkClass}>
          <GitBranch className="size-4" />
          Role Hierarchy
        </NavLink>

        {isAdmin ? (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setUsersRolesOpen((open) => !open)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isUsersRolesSection || usersRolesOpen
                  ? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
              )}
            >
              <span className="flex items-center gap-2">
                <UsersRound className="size-4" />
                Users and Roles
              </span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  usersRolesOpen ? "rotate-180" : "rotate-0",
                )}
              />
            </button>

            {usersRolesOpen ? (
              <div className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-2">
                <NavLink to="/users" className={navLinkClass}>
                  <Users className="size-4" />
                  Users
                </NavLink>
                <NavLink to="/roles" className={navLinkClass}>
                  <Shield className="size-4" />
                  Roles
                </NavLink>
              </div>
            ) : null}
          </div>
        ) : null}
      </nav>
    </aside>
  );
}
