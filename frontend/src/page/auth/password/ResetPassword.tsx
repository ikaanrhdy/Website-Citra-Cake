import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { m, LazyMotion, domAnimation } from "motion/react";

const ResetPassword = () => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-purple-100 flex flex-col px-6 py-4 relative"
      >
        {/* Back Button */}
        <m.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-purple-200 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-purple-800" />
        </m.button>

        <div className="flex flex-col items-center justify-center flex-1 text-start lg:text-center">
          <m.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="text-2xl font-semibold mb-2 text-purple-900 font-serif"
          >
            Reset Password
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 100 }}
            className="text-sm text-gray-600 mb-8 max-w-xs"
          >
            Create a new password for your account.
          </m.p>

          {/* Form */}
          <form className="w-full max-w-xs space-y-6">
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <label className="text-sm text-gray-700 mb-1">New Password</label>
              <div className="relative flex items-center">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter new password"
                  className="bg-white border-purple-300 focus:ring-purple-500 focus:border-purple-500 pr-10 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 100 }}
            >
              <label className="text-sm text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="bg-white border-purple-300 focus:ring-purple-500 focus:border-purple-500 pr-10 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPw ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </m.div>

            <m.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                asChild
                className="w-full bg-purple-900 text-white py-3 rounded-md hover:bg-purple-800 transition"
              >
                <Link to="/reset-password-success">Reset Password</Link>
              </Button>
            </m.div>
          </form>

          <m.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 100 }}
            className="text-sm text-gray-600 mt-6"
          >
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-purple-700 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </m.p>
        </div>
      </m.div>
    </LazyMotion>
  );
};

export default ResetPassword;
