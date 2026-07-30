import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchRoles } from "@/features/roles/api/roles-api";
import { ROLE_PERMISSION_OPTIONS } from "@/types/role";

function permissionLabel(permission: string) {
  return (
    ROLE_PERMISSION_OPTIONS.find((option) => option.value === permission)
      ?.label ?? permission
  );
}

export function RolesPanel() {
  const navigate = useNavigate();
  const {
    data: roles = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      "Failed to load roles")
    : "Failed to load roles";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            Role definitions, permissions, and reporting hierarchy.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => navigate("/roles/new")}>
          <Plus className="size-4" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading roles...
          </div>
        ) : null}

        {isError ? (
          <div className="space-y-3 py-4">
            <p className="text-sm text-destructive">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="space-y-3">
            {isFetching ? (
              <p className="text-xs text-muted-foreground">Refreshing...</p>
            ) : null}
            {roles.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No roles found. Click Add Role or run the BE seed script.
              </p>
            ) : (
              roles.map((role) => (
                <div key={role.id} className="rounded-lg border px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium">{role.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {role.permissions.length} permission
                          {role.permissions.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      {role.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        Reports to:{" "}
                        <span className="font-medium text-foreground">
                          {role.reportsToName ?? "None (top level)"}
                        </span>
                        {" · "}
                        Weightage:{" "}
                        <span className="font-medium text-foreground">
                          {role.weightage ?? 0}
                        </span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                          >
                            {permissionLabel(permission)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/roles/${role.id}/edit`)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
