import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Menu,
  Pencil,
  Mail,
  Phone,
  User,
  Calendar,
  MapPin,
  LogOut,
} from "lucide-react";
import { useUserLayoutContext } from "@/layout/userLayoutContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import useAuthStore from "@/app/store/auth";
import { useCartStore } from "@/app/store/useCartProduct";
import { clearAllStorage } from "@/lib/clearAllStorage";

const Profile = () => {
  const navigate = useNavigate();
  const { onOpenSidebar } = useUserLayoutContext();

  // ===== Ambil data langsung dari Firebase currentUser =====
  // Aman diakses di sini karena Profile sudah dibungkus ProtectedRoutes,
  // yang memastikan user pasti sudah login sebelum render sampai ke sini.
  const currentUser = auth.currentUser;
  const store = useAuthStore();

  const data = {
    name: currentUser?.displayName || store.name || "Pengguna",
    email: currentUser?.email || store.email || "-",
    phone: currentUser?.phoneNumber || store.phone || undefined,
    gender: store.gender || undefined,
    birthDate: store.birthDate || undefined,
    address: store.address || undefined,
    memberSince: currentUser?.metadata.creationTime || undefined,
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      store.logout();
      useCartStore.getState().clearCart();
      useCartStore.getState().clearCheckout();

      // baru sapu bersih localStorage & sessionStorage
      clearAllStorage();

      navigate("/login");
    } catch {
      toast.error("Gagal logout, coba lagi");
    }
  };

  const infoRows = [
    { icon: <Mail size={18} />, label: "Email", value: data.email },
    { icon: <Phone size={18} />, label: "Nomor Telepon", value: data.phone },
    { icon: <User size={18} />, label: "Jenis Kelamin", value: data.gender },
    {
      icon: <Calendar size={18} />,
      label: "Tanggal Lahir",
      value: data.birthDate,
    },
    { icon: <MapPin size={18} />, label: "Alamat", value: data.address },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between bg-white p-3 md:p-5 md:px-8 border-b sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSidebar}
            className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <h2 className="font-serif font-bold text-base md:text-xl">
            Profil Saya
          </h2>
        </div>

        <Link
          to="/edit-profile"
          className="flex items-center gap-1.5 text-primary font-medium text-sm hover:opacity-80 transition cursor-pointer"
        >
          <Pencil size={16} />
          Edit
        </Link>
      </div>

      {/* ================= CONTENT ================= */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 p-4 md:p-8 md:max-w-2xl md:mx-auto w-full"
      >
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* === HEADER CARD === */}
          <div className="bg-linear-to-r from-[#5F2C7A] to-[#825a97] px-5 py-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-[#5F2C7A]" />
              )}
            </div>
            <div className="flex flex-col gap-1 text-white">
              <h3 className="font-serif font-bold text-lg">{data.name}</h3>
              <p className="text-xs text-white/80">
                Member since {data.memberSince}
              </p>
            </div>
          </div>

          {/* === INFO LIST === */}
          <div className="flex flex-col divide-y divide-gray-100 px-5">
            {infoRows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1 py-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  {row.icon}
                  <span>{row.label}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 pl-6">
                  {row.value || "-"}
                </p>
              </div>
            ))}
          </div>

          {/* === LOGOUT === */}
          <div className="p-5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition text-white font-medium py-3 rounded-xl cursor-pointer"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
