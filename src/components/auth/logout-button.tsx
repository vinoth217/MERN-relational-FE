import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logoutRequest } from "@/features/auth/api/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export function LogoutButton() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logoutRequest();
    dispatch(logout());
    toast.success("Signed out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="size-4" />
      Logout
    </Button>
  );
}
