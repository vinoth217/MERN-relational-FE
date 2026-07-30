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
import {
  fetchRoleById,
  fetchRoles,
  updateRoleRequest,
} from "@/features/roles/api/roles-api";
import {
  createRoleSchema,
  type CreateRoleFormValues,
} from "@/features/roles/schemas/create-role-schema";
import { ROLE_PERMISSION_OPTIONS } from "@/types/role";

export function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: role,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["roles", id],
    queryFn: () => fetchRoleById(id!),
    enabled: Boolean(id),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
      reportsToId: "",
    },
  });

  useEffect(() => {
    if (!role) return;
    reset({
      name: role.name,
      description: role.description ?? "",
      permissions: role.permissions,
      reportsToId: role.reportsToId ?? "",
    });
  }, [role, reset]);

  const selectedPermissions = watch("permissions") ?? [];
  const reportingOptions = roles.filter((item) => item.id !== id);

  const updateMutation = useMutation({
    mutationFn: (values: CreateRoleFormValues) =>
      updateRoleRequest(id!, {
        name: values.name,
        description: values.description?.trim() || undefined,
        permissions: values.permissions,
        reportsToId: values.reportsToId || undefined,
      }),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(`Role ${updated.name} updated`);
      navigate("/roles", { replace: true });
    },
    onError: (mutationError) => {
      const message = isAxiosError(mutationError)
        ? ((mutationError.response?.data as { message?: string } | undefined)
            ?.message ?? "Failed to update role")
        : "Failed to update role";
      toast.error(message);
    },
  });

  const togglePermission = (
    permission: CreateRoleFormValues["permissions"][number],
  ) => {
    const next = selectedPermissions.includes(permission)
      ? selectedPermissions.filter((item) => item !== permission)
      : [...selectedPermissions, permission];
    setValue("permissions", next, { shouldValidate: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
        <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading role...
      </div>
    );
  }

  if (isError || !role) {
    const message = isAxiosError(error)
      ? ((error.response?.data as { message?: string } | undefined)?.message ??
        "Role not found")
      : "Role not found";

    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{message}</p>
        <Button type="button" variant="outline" onClick={() => navigate("/roles")}>
          Back to roles
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
          onClick={() => navigate("/roles")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Role</h1>
          <p className="text-sm text-muted-foreground">
            Update permissions and reporting role.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role details</CardTitle>
          <CardDescription>
            Change role details and who this role reports to.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Role name</Label>
              <Input id="name" {...register("name")} />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" {...register("description")} />
              {errors.description ? (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportsToId">Reporting role</Label>
              <select
                id="reportsToId"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                {...register("reportsToId")}
              >
                <option value="">None (top level)</option>
                {reportingOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {ROLE_PERMISSION_OPTIONS.map((option) => {
                  const checked = selectedPermissions.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={checked}
                        onChange={() => togglePermission(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors.permissions ? (
                <p className="text-sm text-destructive">
                  {errors.permissions.message}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/roles")}
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
