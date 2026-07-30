import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export function AdminOnlyRoute() {
  const role = useAppSelector((state) => state.auth.user?.role);

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
