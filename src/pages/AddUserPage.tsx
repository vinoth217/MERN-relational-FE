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
import { createUserRequest } from "@/features/users/api/users-api";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/users/schemas/user-schemas";

const ROLE_OPTIONS = [
  "ADMIN",
  "ORG_MANAGER",
  "PROJECT_MANAGER",
  "MEMBER",
] as const;

export function AddUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
      projectId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createUserRequest,
    onSuccess: async (user) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${user.name} created`);
      navigate("/users", { replace: true });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string } | undefined)
            ?.message ?? "Failed to create user")
        : "Failed to create user";
      toast.error(message);
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/users")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Add User</h1>
          <p className="text-sm text-muted-foreground">
            Create a user and assign them to a project.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User details</CardTitle>
          <CardDescription>
            Organization is fixed to ProjectFlow HQ. Assign a project below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit((values) => createMutation.mutate(values))}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password ? (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                {...register("role")}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role ? (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
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
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create user"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
