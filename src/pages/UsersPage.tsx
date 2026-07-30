import { UsersPanel } from "@/components/users/users-panel";

export function UsersPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage organization users from this module.
        </p>
      </section>
      <UsersPanel />
    </div>
  );
}
