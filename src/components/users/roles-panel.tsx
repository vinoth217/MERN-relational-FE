import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const demoRoles = [
  {
    role: "ADMIN",
    description: "Full system access across organizations and settings.",
  },
  {
    role: "ORG_MANAGER",
    description: "Manage organization members, projects, and reporting.",
  },
  {
    role: "PROJECT_MANAGER",
    description: "Create projects, assign tasks, and track delivery.",
  },
  {
    role: "MEMBER",
    description: "Work on assigned tasks, subtasks, and comments.",
  },
];

export function RolesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
        <CardDescription>
          Hierarchical role definitions used for access control.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoRoles.map((item) => (
          <div
            key={item.role}
            className="rounded-lg border px-4 py-3"
          >
            <p className="text-sm font-medium">{item.role}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
