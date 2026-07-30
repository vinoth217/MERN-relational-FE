import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  fetchUserById,
  updateUserRequest,
} from "@/features/users/api/users-api";
import {
  updateUserSchema,
  type UpdateUserFormValues,
} from "@/features/users/schemas/user-schemas";

export function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error,
  } = useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUserById(id!),
    enabled: Boolean(id),
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      projectId: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      projectId: user.projectId ?? "",
    });
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: UpdateUserFormValues) =>
      updateUserRequest(id!, values),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${updated.name} updated`);
      navigate("/users", { replace: true });
    },
    onError: (mutationError) => {
      const message = isAxiosError(mutationError)
        ? ((mutationError.response?.data as { message?: string } | undefined)
            ?.message ?? "Failed to update user")
        : "Failed to update user";
      toast.error(message);
    },
  });

  if (userLoading) {
    return (
      <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
        <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading user...
      </div>
    );
  }

  if (userError || !user) {
    const message = isAxiosError(error)
      ? ((error.response?.data as { message?: string } | undefined)?.message ??
        "User not found")
      : "User not found";
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{message}</p>
        <Button type="button" variant="outline" onClick={() => navigate("/users")}>
          Back to users
        </Button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-semibold tracking-tight">Edit User</h1>
          <p className="text-sm text-muted-foreground">
            Update name and assigned project only.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>
            View user details below. Only name and project can be updated.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
        >
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user.role} disabled readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={user.organizationName ?? "ProjectFlow HQ"}
                disabled
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
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
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
