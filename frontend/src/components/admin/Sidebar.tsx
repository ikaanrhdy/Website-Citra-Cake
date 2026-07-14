import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { menuAdmin, logoutMenu } from "@/data/menu";
import useAuthStore from "@/app/store/auth";
import { clearAllStorage } from "@/lib/clearAllStorage";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
};

const mobileVariants = {
  hidden: { x: "-100%" },
  show: { x: 0 },
};

const Sidebar = ({ isOpen, onClose, onLogout }: Props) => {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <SidebarContent onLogout={onLogout} />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />

            <motion.aside
              variants={mobileVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed z-50 w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col lg:hidden"
            >
              <SidebarContent onClose={onClose} onLogout={onLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

// ================= SidebarContent.tsx =================
const SidebarContent = ({
  onClose,
  onLogout,
}: {
  onClose?: () => void;
  onLogout?: () => void;
}) => {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  // narrow: Sidebar ini konteksnya cuma admin, jadi "customer" gak relevan di sini
  const adminRole = role !== "customer" ? role : null;

  const visibleMenus = menuAdmin.filter(
    (menu) => adminRole && menu.roles.includes(adminRole),
  );

  const handleLogout = () => {
    useAuthStore.getState().logout();
    clearAllStorage();
    if (onLogout) onLogout();
    navigate("/login-admin");
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top: Logo + Menu */}
      <div>
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
          <div>
            <h1 className="text-xl font-bold text-primary font-serif">
              Citra Cake
            </h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>

          {/* Close button — cuma muncul di mobile drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition cursor-pointer lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="px-3 pt-4 space-y-1">
          {visibleMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <NavLink
                key={menu.name}
                to={menu.path}
                end
                onClick={onClose}
                className="relative block"
              >
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg 
                      text-sm font-medium transition relative 
                      ${
                        isActive
                          ? "bg-purple-50 text-primary"
                          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
                      }`}
                  >
                    {Icon ? (
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-primary" : ""}`}
                      />
                    ) : (
                      <img
                        src={menu.iconUrl}
                        className="w-4 h-4"
                        alt={menu.name}
                      />
                    )}

                    <span className="flex-1">{menu.name}</span>

                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-dot"
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: LogOut + Footer */}
      <div className="px-3 mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex justify-center items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-500 hover:text-white transition cursor-pointer"
        >
          <logoutMenu.icon className="w-4 h-4" />
          <span>{logoutMenu.name}</span>
        </button>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          © 2025 Admin
        </div>
      </div>
    </div>
  );
};
