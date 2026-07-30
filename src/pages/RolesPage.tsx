import { RolesPanel } from "@/components/users/roles-panel";

export function RolesPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Roles</h1>
        <p className="text-muted-foreground">
          Review hierarchical roles used for access control.
        </p>
      </section>
      <RolesPanel />
    </div>
  );
}
