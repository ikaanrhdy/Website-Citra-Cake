import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/get-started"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-purple-100 flex items-center justify-center min-h-screen">
      <motion.img
        src="/logo/logo.png"
        alt="logo"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.9,
          ease: "easeOut",
        }}
        className="w-32 h-32 md:w-52 md:h-52 lg:w-64 lg:h-64"
      />
    </div>
  );
};

export default SplashScreen;
