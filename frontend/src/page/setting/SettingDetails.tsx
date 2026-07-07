import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router";

const MotionLink = motion(Link);

const itemHover = {
  hover: { scale: 1.01 },
  tap: { scale: 0.98 },
};

const SettingDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-row bg-white p-3 md:px-6 items-center justify-between border-b"
      >
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
          >
            <ArrowLeft />
          </button>

          <h2 className="font-medium text-sm md:text-base">Pengaturan Akun</h2>
        </div>

        <IoMdHelpCircleOutline className="text-primary size-6 md:size-8" />
      </motion.div>

      {/* ================= AKUN SAYA ================= */}
      <div className="flex px-10 py-5">
        <h2 className="text-gray-600 text-sm">Akun Saya</h2>
      </div>

      <div className="flex flex-col gap-1">
        {[
          { label: "Akun & Keamanan", to: "/profile/settings/account" },
          { label: "Alamat Saya", to: "/profile/settings/address" },
          { label: "Kartu/Rekening Bank", to: "/payment/bank" },
        ].map((item, i) => (
          <MotionLink
            key={i}
            to={item.to}
            variants={itemHover}
            whileHover="hover"
            whileTap="tap"
            className="flex flex-col mx-5 bg-white px-5 py-4 transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-medium font-serif">{item.label}</h2>
              <ChevronRight />
            </div>
          </MotionLink>
        ))}
      </div>

      {/* ================= PENGATURAN ================= */}
      <div className="flex px-10 py-5">
        <h2 className="text-gray-600 text-sm">Pengaturan</h2>
      </div>

      <MotionLink
        to="/profile/settings/language"
        variants={itemHover}
        whileHover="hover"
        whileTap="tap"
        className="flex flex-col mx-5 bg-white px-5 py-4 transition"
      >
        <div className="flex justify-between">
          <h2 className="font-medium font-serif">Bahasa / Language</h2>
          <ChevronRight />
        </div>
        <p className="text-[10px] text-gray-500">Bahasa Indonesia</p>
      </MotionLink>

      {/* ================= BANTUAN ================= */}
      <div className="flex px-10 py-5">
        <h2 className="text-gray-600 text-sm">Bantuan</h2>
      </div>

      <div className="flex flex-col gap-1">
        {/* Pusat Bantuan */}
        <MotionLink
          to="/help"
          variants={itemHover}
          whileHover="hover"
          whileTap="tap"
          className="flex flex-col mx-5 bg-white px-5 py-4 transition"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-medium font-serif">Pusat Bantuan</h2>
            <ChevronRight />
          </div>
        </MotionLink>

        {/* ========== HAPUS AKUN (DIALOG) ========== */}
        <Dialog>
          <DialogTrigger asChild>
            <motion.div
              variants={itemHover}
              whileHover="hover"
              whileTap="tap"
              className="flex flex-col mx-5 bg-white px-5 py-4 transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-medium font-serif text-red-600">
                  Ajukan Penghapusan Akun
                </h2>
                <ChevronRight className="text-red-500" />
              </div>
            </motion.div>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Hapus Akun</DialogTitle>
              <DialogDescription>
                Tindakan ini bersifat <b>permanen</b>. Semua data akun kamu akan
                dihapus dan tidak dapat dipulihkan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => navigate("/profile/settings/deleteAccount")}
              >
                Ya, Hapus Akun
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ================= LOGOUT ================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col items-center mt-5 gap-3"
      >
        <Link to="/login" className="w-full flex justify-center">
          <Button className="w-3/4 bg-transparent border border-gray-500 text-black hover:bg-primary hover:text-white">
            Ganti Akun
          </Button>
        </Link>

        <Link to="/login" className="w-full flex justify-center">
          <Button className="w-3/4 bg-transparent border border-gray-500 text-black hover:bg-red-500 hover:text-white">
            Logout
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default SettingDetails;
