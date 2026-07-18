import useAuthStore from "@/app/store/auth";
import { Navigate, Outlet } from "react-router";

export default function ProtectedAdminRoute() {
  const { isAuthenticated, isLoading, isTokenExpired, logout } = useAuthStore();

  // Memastikan sistem dalam kondisi siap (tidak sedang memuat)
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Validasi autentikasi dan masa berlaku token
  if (!isAuthenticated || isTokenExpired()) {
    if (isAuthenticated) logout(); // bersihin state kalau ternyata token udah basi
    return <Navigate to="/login-admin" replace />;
  }

  // Mengizinkan akses jika validasi berhasil
  return <Outlet />;
}
