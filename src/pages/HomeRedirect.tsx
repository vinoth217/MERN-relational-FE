import { Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { useAppSelector } from "@/store/hooks";
import { persistor } from "@/store";

function HomeRedirectInner() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export function HomeRedirect() {
  return (
    <PersistGate
      loading={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      }
      persistor={persistor}
    >
      <HomeRedirectInner />
    </PersistGate>
  );
}
