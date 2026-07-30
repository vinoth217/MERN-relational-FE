import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchProjects } from "@/features/projects/api/projects-api";
import { createTaskRequest } from "@/features/tasks/api/tasks-api";
import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "@/features/tasks/schemas/create-task-schema";
import { fetchUsers } from "@/features/users/api/users-api";
import { useAppSelector } from "@/store/hooks";
import { TASK_PRIORITIES } from "@/types/task";

function defaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

export function AddTaskPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.auth.user);

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", currentUser?.id],
    queryFn: fetchProjects,
    enabled: Boolean(currentUser?.id),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users", currentUser?.id],
    queryFn: fetchUsers,
    enabled: Boolean(currentUser?.id),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      projectId: "",
      dueDate: defaultDueDate(),
      priority: "MEDIUM",
      assignedTo: "",
    },
  });

  useEffect(() => {
    if (projects.length === 1) {
      setValue("projectId", projects[0].id);
    } else if (currentUser?.projectId) {
      const match = projects.find((project) => project.id === currentUser.projectId);
      if (match) {
        setValue("projectId", match.id);
      }
    }
  }, [projects, currentUser?.projectId, setValue]);

  const assigneeOptions = useMemo(() => {
    if (!currentUser?.projectId) {
      return users;
    }
    return users.filter((user) => user.projectId === currentUser.projectId);
  }, [users, currentUser?.projectId]);

  const createMutation = useMutation({
    mutationFn: createTaskRequest,
    onSuccess: async (task) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
      ]);
      toast.success(`Task ${task.name} created`);
      navigate("/tasks", { replace: true });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string } | undefined)
            ?.message ?? "Failed to create task")
        : "Failed to create task";
      toast.error(message);
    },
  });

  const onSubmit = (values: CreateTaskFormValues) => {
    createMutation.mutate({
      name: values.name,
      description: values.description?.trim() || undefined,
      projectId: values.projectId,
      dueDate: new Date(values.dueDate).toISOString(),
      priority: values.priority,
      assignedTo: values.assignedTo,
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/tasks")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Task</h1>
          <p className="text-sm text-muted-foreground">
            Define task details, project mapping, timeline, and assignee.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task details</CardTitle>
          <CardDescription>
            Task created is set automatically to the current signed-in user.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Task name</Label>
              <Input id="name" placeholder="e.g. Design login page" {...register("name")} />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none"
                placeholder="Describe the task"
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project mapping</Label>
              <select
                id="projectId"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                disabled={projectsLoading}
                {...register("projectId")}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId ? (
                <p className="text-sm text-destructive">
                  {errors.projectId.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Timeline to complete</Label>
                <Input id="dueDate" type="date" {...register("dueDate")} />
                {errors.dueDate ? (
                  <p className="text-sm text-destructive">
                    {errors.dueDate.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                  {...register("priority")}
                >
                  {TASK_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                {errors.priority ? (
                  <p className="text-sm text-destructive">
                    {errors.priority.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdBy">Task created</Label>
              <Input
                id="createdBy"
                value={currentUser?.name ?? "Current user"}
                disabled
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign to</Label>
              <select
                id="assignedTo"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                disabled={usersLoading}
                {...register("assignedTo")}
              >
                <option value="">Select a user</option>
                {assigneeOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.assignedTo ? (
                <p className="text-sm text-destructive">
                  {errors.assignedTo.message}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tasks")}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create task"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
