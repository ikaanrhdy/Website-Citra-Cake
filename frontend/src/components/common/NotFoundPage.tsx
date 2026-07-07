import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 text-center max-w-sm"
      >
        <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center">
          <Ghost className="w-10 h-10 text-primary" />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800">404</h1>
          <p className="text-sm font-medium text-gray-700">
            Halaman tidak ditemukan
          </p>
          <p className="text-xs text-gray-400">
            Halaman yang kamu cari mungkin sudah dipindahkan atau tidak
            tersedia.
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          className="bg-primary text-white cursor-pointer px-6"
        >
          Kembali ke Beranda
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
