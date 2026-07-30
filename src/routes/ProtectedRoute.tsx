import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { useAppSelector } from "@/store/hooks";
import { persistor } from "@/store";

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function ProtectedOutlet() {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  return (
    <PersistGate
      loading={<LoadingScreen label="Loading session..." />}
      persistor={persistor}
    >
      <ProtectedOutlet />
    </PersistGate>
  );
}
