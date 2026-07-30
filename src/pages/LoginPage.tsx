import { LoginForm } from "@/components/auth/login-form";

export function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(30,41,59,0.1),_transparent_40%)]" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            ProjectFlow
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Hierarchical project & task management for modern organizations
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
