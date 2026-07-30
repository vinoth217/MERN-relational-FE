import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTasks } from "@/features/tasks/api/tasks-api";
import { fetchUsers } from "@/features/users/api/users-api";
import { useAppSelector } from "@/store/hooks";
import type { UserRole } from "@/types/auth";

const PAGE_SIZE = 5;

const ROLE_OPTIONS: Array<UserRole | "ALL"> = [
  "ALL",
  "ADMIN",
  "ORG_MANAGER",
  "PROJECT_MANAGER",
  "MEMBER",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export function TasksPanel() {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [userFilter, setUserFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [appliedUserFilter, setAppliedUserFilter] = useState("ALL");
  const [appliedRoleFilter, setAppliedRoleFilter] = useState<UserRole | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: fetchTasks,
    enabled: Boolean(userId),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users", userId],
    queryFn: fetchUsers,
    enabled: Boolean(userId),
  });

  const userRoleById = useMemo(() => {
    const map = new Map<string, UserRole>();
    for (const user of users) {
      map.set(user.id, user.role);
    }
    return map;
  }, [users]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesUser =
        appliedUserFilter === "ALL" ||
        task.assignedToId === appliedUserFilter;

      const assigneeRole = task.assignedToId
        ? userRoleById.get(task.assignedToId)
        : undefined;

      const matchesRole =
        appliedRoleFilter === "ALL" || assigneeRole === appliedRoleFilter;

      return matchesUser && matchesRole;
    });
  }, [tasks, appliedUserFilter, appliedRoleFilter, userRoleById]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [appliedUserFilter, appliedRoleFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedTasks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTasks.slice(start, start + PAGE_SIZE);
  }, [filteredTasks, page]);

  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      "Failed to load tasks")
    : "Failed to load tasks";

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedUserFilter(userFilter);
    setAppliedRoleFilter(roleFilter);
  };

  const clearFilters = () => {
    setUserFilter("ALL");
    setRoleFilter("ALL");
    setAppliedUserFilter("ALL");
    setAppliedRoleFilter("ALL");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Tasks for your associated project.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => navigate("/tasks/new")}>
          <Plus className="size-4" />
          Create Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={applyFilters}
          className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="taskUserFilter">User</Label>
            <select
              id="taskUserFilter"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
              value={userFilter}
              onChange={(event) => setUserFilter(event.target.value)}
            >
              <option value="ALL">All users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskRoleFilter">Role</Label>
            <select
              id="taskRoleFilter"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as UserRole | "ALL")
              }
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role === "ALL" ? "All roles" : role}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" size="sm">
            Apply filters
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </form>

        {isLoading ? (
          <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading tasks...
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
          <div className="space-y-4">
            <div className="overflow-x-auto">
              {isFetching ? (
                <p className="mb-3 text-xs text-muted-foreground">
                  Refreshing...
                </p>
              ) : null}
              {tasks.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  No tasks found. Click Create Task to add one.
                </p>
              ) : filteredTasks.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  No tasks match the selected filters.
                </p>
              ) : (
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="border-b text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">Task</th>
                      <th className="pb-3 font-medium">Project</th>
                      <th className="pb-3 font-medium">Priority</th>
                      <th className="pb-3 font-medium">Due date</th>
                      <th className="pb-3 font-medium">Created</th>
                      <th className="pb-3 font-medium">Assign to</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedTasks.map((task) => (
                      <tr key={task.id} className="border-b last:border-0">
                        <td className="py-3">
                          <p className="font-medium">{task.name}</p>
                          {task.description ? (
                            <p className="text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {task.projectName ?? "—"}
                        </td>
                        <td className="py-3">{task.priority}</td>
                        <td className="py-3 text-muted-foreground">
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          <div>{formatDate(task.createdAt)}</div>
                          <div className="text-xs">
                            {task.createdByName ?? "—"}
                          </div>
                        </td>
                        <td className="py-3">{task.assignedToName ?? "—"}</td>
                        <td className="py-3">{task.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {filteredTasks.length > 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}-
                  {Math.min(page * PAGE_SIZE, filteredTasks.length)} of{" "}
                  {filteredTasks.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
