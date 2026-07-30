import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchProjects } from "@/features/projects/api/projects-api";
import { useAppSelector } from "@/store/hooks";
import type { ProjectStatus } from "@/types/project";

function statusLabel(status: ProjectStatus) {
  switch (status) {
    case "NOT_STARTED":
      return "Not started";
    case "IN_PROGRESS":
      return "In progress";
    case "ON_HOLD":
      return "On hold";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
}

export function ProjectsPage() {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects", userId],
    queryFn: fetchProjects,
    enabled: Boolean(userId),
  });

  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      "Failed to load projects")
    : "Failed to load projects";

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Projects associated with your account. Track status and task progress.
        </p>
      </section>

      {isLoading ? (
        <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading projects...
        </div>
      ) : null}

      {isError ? (
        <div className="space-y-3">
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
        projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No project is associated with your account.
          </p>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-base">{project.name}</CardTitle>
                <CardDescription>
                  {project.description ?? "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">
                    {statusLabel(project.status)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Tasks in progress</span>
                  <span className="font-medium">{project.taskInProgress}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Tasks completed</span>
                  <span className="font-medium">{project.taskCompleted}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Total tasks</span>
                  <span className="font-medium">{project.taskTotal}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )
      ) : null}
    </div>
  );
}
