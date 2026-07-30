import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomeRedirect } from "@/pages/HomeRedirect";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { UsersPage } from "@/pages/UsersPage";
import { AddUserPage } from "@/pages/AddUserPage";
import { EditUserPage } from "@/pages/EditUserPage";
import { RolesPage } from "@/pages/RolesPage";
import { AddRolePage } from "@/pages/AddRolePage";
import { EditRolePage } from "@/pages/EditRolePage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { TasksPage } from "@/pages/TasksPage";
import { AddTaskPage } from "@/pages/AddTaskPage";
import { RoleHierarchyPage } from "@/pages/RoleHierarchyPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AdminOnlyRoute } from "@/routes/AdminOnlyRoute";
import { AppShellLayout } from "@/layouts/AppShellLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShellLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/new" element={<AddTaskPage />} />
            <Route path="/hierarchy" element={<RoleHierarchyPage />} />
            <Route element={<AdminOnlyRoute />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/new" element={<AddUserPage />} />
              <Route path="/users/:id/edit" element={<EditUserPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/roles/new" element={<AddRolePage />} />
              <Route path="/roles/:id/edit" element={<EditRolePage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
