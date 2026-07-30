import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  fetchRoles,
  updateRoleWeightagesRequest,
} from "@/features/roles/api/roles-api";
import { useAppSelector } from "@/store/hooks";
import type { Role } from "@/types/role";

type WeightageDraft = Record<string, string>;

const ADMIN_ROLE = "ADMIN";
const ADMIN_WEIGHTAGE = 1;

function toDraft(roles: Role[]): WeightageDraft {
  return Object.fromEntries(
    roles.map((role) => [
      role.id,
      String(
        role.name === ADMIN_ROLE
          ? ADMIN_WEIGHTAGE
          : Math.max(role.weightage ?? ADMIN_WEIGHTAGE, ADMIN_WEIGHTAGE),
      ),
    ]),
  );
}

function findDuplicateWeightage(
  roles: Role[],
  draft: WeightageDraft,
  roleId: string,
  weightage: number,
): Role | undefined {
  return roles.find((role) => {
    if (role.id === roleId) return false;
    const other = Number(draft[role.id] ?? role.weightage);
    return other === weightage;
  });
}

export function RoleHierarchyPage() {
  const queryClient = useQueryClient();
  const isAdmin = useAppSelector((state) => state.auth.user?.role) === "ADMIN";
  const [draft, setDraft] = useState<WeightageDraft>({});
  const [formError, setFormError] = useState<string | null>(null);

  const {
    data: roles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  useEffect(() => {
    if (roles.length > 0) {
      setDraft(toDraft(roles));
    }
  }, [roles]);

  const orderedRoles = useMemo(() => {
    return [...roles].sort((a, b) => {
      const weightA =
        a.name === ADMIN_ROLE
          ? ADMIN_WEIGHTAGE
          : Number(draft[a.id] ?? a.weightage ?? ADMIN_WEIGHTAGE);
      const weightB =
        b.name === ADMIN_ROLE
          ? ADMIN_WEIGHTAGE
          : Number(draft[b.id] ?? b.weightage ?? ADMIN_WEIGHTAGE);
      if (weightA !== weightB) return weightA - weightB;
      return a.name.localeCompare(b.name);
    });
  }, [roles, draft]);

  const saveMutation = useMutation({
    mutationFn: updateRoleWeightagesRequest,
    onSuccess: async (updatedRoles) => {
      setFormError(null);
      setDraft(toDraft(updatedRoles));
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (mutationError) => {
      const message = isAxiosError(mutationError)
        ? ((mutationError.response?.data as { message?: string } | undefined)
            ?.message ?? "Failed to save role weightages")
        : "Failed to save role weightages";
      setFormError(message);
    },
  });

  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      "Failed to load roles")
    : "Failed to load roles";

  function handleWeightageChange(role: Role, value: string) {
    if (!isAdmin || role.name === ADMIN_ROLE) return;

    setDraft((current) => ({ ...current, [role.id]: value }));

    const trimmed = value.trim();
    if (trimmed === "") {
      setFormError(null);
      return;
    }

    const weightage = Number(trimmed);
    if (Number.isNaN(weightage) || !Number.isInteger(weightage) || weightage < 1) {
      setFormError(`Enter a whole number starting from 1 for ${role.name}.`);
      return;
    }

    const duplicate = findDuplicateWeightage(
      roles,
      { ...draft, [role.id]: value },
      role.id,
      weightage,
    );
    if (duplicate) {
      setFormError(
        `Weightage ${weightage} already exists for ${duplicate.name}. Change that role's weightage first, then change this.`,
      );
      return;
    }

    setFormError(null);
  }

  function handleSave() {
    if (!isAdmin) return;
    setFormError(null);

    const weightages: Array<{ id: string; weightage: number }> = [];
    const seen = new Map<number, string>();

    for (const role of roles) {
      const weightage =
        role.name === ADMIN_ROLE
          ? ADMIN_WEIGHTAGE
          : Number(draft[role.id]?.trim() ?? "");

      if (
        role.name !== ADMIN_ROLE &&
        (draft[role.id]?.trim() === "" ||
          Number.isNaN(weightage) ||
          !Number.isInteger(weightage) ||
          weightage < 1)
      ) {
        setFormError(
          `Enter a whole number starting from 1 for ${role.name}.`,
        );
        return;
      }

      const existingName = seen.get(weightage);
      if (existingName) {
        setFormError(
          `Weightage ${weightage} already exists for ${existingName}. Change that role's weightage first, then change this.`,
        );
        return;
      }

      seen.set(weightage, role.name);
      weightages.push({ id: role.id, weightage });
    }

    saveMutation.mutate(weightages);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Role Hierarchy
        </h1>
        <p className="text-muted-foreground">
          Assign ordered weightages starting from 1. ADMIN is fixed at 1; each
          other role must use a unique value.
        </p>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Role weightages</CardTitle>
            <CardDescription>
              Lower weightage ranks higher. Values must be unique per role.
              {!isAdmin ? " Only admins can update weightages." : null}
            </CardDescription>
          </div>
          {isAdmin ? (
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={
                isLoading ||
                isError ||
                saveMutation.isPending ||
                roles.length === 0 ||
                Boolean(formError)
              }
            >
              {saveMutation.isPending ? "Saving..." : "Save weightages"}
            </Button>
          ) : null}
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

          {formError ? (
            <p className="mb-4 text-sm text-destructive">{formError}</p>
          ) : null}

          {!isLoading && !isError ? (
            orderedRoles.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No roles found. Add roles first, then assign weightages here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">Order</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Reports to</th>
                      <th className="pb-3 font-medium">Weightage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderedRoles.map((role, index) => {
                      const isAdminRole = role.name === ADMIN_ROLE;
                      const inputDisabled = !isAdmin || isAdminRole;
                      return (
                        <tr key={role.id} className="border-b last:border-0">
                          <td className="py-3 text-muted-foreground">
                            #{index + 1}
                          </td>
                          <td className="py-3">
                            <p className="font-medium">{role.name}</p>
                            {role.description ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {role.description}
                              </p>
                            ) : null}
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {role.reportsToName ?? "None"}
                          </td>
                          <td className="py-3">
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              inputMode="numeric"
                              disabled={inputDisabled}
                              className="w-28 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              value={
                                isAdminRole
                                  ? String(ADMIN_WEIGHTAGE)
                                  : (draft[role.id] ??
                                    String(role.weightage ?? ADMIN_WEIGHTAGE))
                              }
                              onChange={(event) =>
                                handleWeightageChange(role, event.target.value)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
