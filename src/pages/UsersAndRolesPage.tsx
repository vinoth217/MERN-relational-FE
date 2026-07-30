import { RolesPanel } from "@/components/users/roles-panel";
import { UsersPanel } from "@/components/users/users-panel";

/** Combined view showing both Users and Roles panels together. */
export function UsersAndRolesPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Users and Roles
        </h1>
        <p className="text-muted-foreground">
          Users and roles modules shown together.
        </p>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <UsersPanel />
        <RolesPanel />
      </div>
    </div>
  );
}
