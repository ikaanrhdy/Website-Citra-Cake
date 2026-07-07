import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const GetStarted = () => {
  return (
    <motion.div
      className="grid sm:grid-cols-1 lg:grid-cols-2 items-center min-h-screen w-full bg-purple-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Logo */}
      <motion.div
        className="flex justify-center items-center p-8"
        variants={itemVariants}
      >
        <motion.img
          src="/logo/logo.png"
          alt="logo"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-110 lg:h-110 object-contain"
        />
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col justify-center items-center gap-4 p-5 w-full"
        variants={containerVariants}
      >
        {/* Login */}
        <motion.div
          variants={itemVariants}
          className="w-full flex justify-center"
        >
          <Button
            asChild
            className="w-3/4 bg-purple-900 text-white hover:bg-purple-700"
          >
            <Link to="/login">Login</Link>
          </Button>
        </motion.div>

        {/* Register */}
        <motion.div
          variants={itemVariants}
          className="w-full flex justify-center"
        >
          <Button
            asChild
            className="w-3/4 bg-white border border-purple-800 text-purple-800 hover:bg-purple-200"
          >
            <Link to="/register">Register</Link>
          </Button>
        </motion.div>

        {/* Continue as Guest */}
        <motion.div
          variants={itemVariants}
          className="w-full flex justify-center"
        >
          <Button
            asChild
            variant="ghost"
            className="w-3/4 border bg-white text-[#364153] hover:bg-gray-200 hover:text-purple-800"
          >
            <Link to="/home">Continue as Guest</Link>
          </Button>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-3/4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Login as Admin */}
        <motion.div
          variants={itemVariants}
          className="w-full flex justify-center"
        >
          <Button
            asChild
            className="w-3/4 bg-purple-900 text-white hover:bg-purple-700"
          >
            <Link to="/login-admin">Login as Admin</Link>
          </Button>
        </motion.div>

        {/* Kebijakan */}
        <p className="text-xs text-center text-[#6A7282] pt-2">
          Dengan melanjutkan, Anda menyetujui{" "}
          <span className="text-purple-800 underline cursor-pointer">
            Syarat & Ketentuan
          </span>{" "}
          dan{" "}
          <span className="text-purple-800 underline cursor-pointer">
            Kebijakan Privasi
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GetStarted;
