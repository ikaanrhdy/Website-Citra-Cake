import Sidebar from "@/components/admin/Sidebar";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import useAuthStore from "@/app/store/auth";

export type AdminLayoutContext = {
  onOpenSidebar: () => void;
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout(); // clear isAuthenticated, token, tokenExpiresAt, dst dari store (persist juga ikut kehapus)
    navigate("/login-admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background font-inter lg:grid lg:grid-cols-[256px_1fr]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Content */}
      <div className="flex flex-col">
        <main className="flex-1 p-4 md:p-6">
          <Outlet context={{ onOpenSidebar: () => setSidebarOpen(true) }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
