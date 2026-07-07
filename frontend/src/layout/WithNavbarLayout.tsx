import { Outlet } from "react-router";
import { X } from "lucide-react";
import Navbar from "../components/user/Navbar";
import Sidebar from "../components/user/Sidebar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProductStore } from "@/app/store/useProduct";
import type { UserLayoutContext } from "./userLayoutContext";

const UserLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const getProducts = useProductStore((s) => s.getProducts);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 w-full relative">
        {/* Sidebar Desktop */}
        <AnimatePresence mode="wait">
          {openSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
              className="hidden lg:block bg-white shadow-md border-r overflow-hidden"
            >
              <Sidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Mobile & Tablet */}
        <AnimatePresence>
          {openSidebar && (
            <>
              <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "spring", stiffness: 90, damping: 15 }}
                className="lg:hidden fixed top-0 left-0 h-full w-56 bg-white shadow-xl z-50"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-primary">Menu</h2>
                  <button
                    onClick={() => setOpenSidebar(false)}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <Sidebar onClose={() => setOpenSidebar(false)} />
              </motion.aside>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black lg:hidden z-40"
                onClick={() => setOpenSidebar(false)}
              />
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet
            context={
              { onOpenSidebar: toggleSidebar } satisfies UserLayoutContext
            }
          />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
