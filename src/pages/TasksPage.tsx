import { TasksPanel } from "@/components/tasks/tasks-panel";

export function TasksPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Create and track tasks across projects.
        </p>
      </section>
      <TasksPanel />
    </div>
  );
}
