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
import { fetchUsers } from "@/features/users/api/users-api";

export function UsersPanel() {
  const navigate = useNavigate();
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      "Failed to load users")
    : "Failed to load users";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Team members assigned to projects in the organization.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => navigate("/users/new")}>
          <Plus className="size-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading users...
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
          <div className="overflow-x-auto">
            {isFetching ? (
              <p className="mb-3 text-xs text-muted-foreground">Refreshing...</p>
            ) : null}
            {users.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No users found. Click Add User or run the BE seed script.
              </p>
            ) : (
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="py-3">{user.role}</td>
                      <td className="py-3 text-muted-foreground">
                        {user.projectName ?? "—"}
                      </td>
                      <td className="py-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
