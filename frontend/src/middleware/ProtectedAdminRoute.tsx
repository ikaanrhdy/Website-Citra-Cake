import useAuthStore from "@/app/store/auth";
import { Navigate, Outlet } from "react-router";

export default function ProtectedAdminRoute() {
  const { isAuthenticated, isLoading, isTokenExpired, logout } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || isTokenExpired()) {
    if (isAuthenticated) logout(); // bersihin state kalau ternyata token udah basi
    return <Navigate to="/login-admin" replace />;
  }

  return <Outlet />;
}
