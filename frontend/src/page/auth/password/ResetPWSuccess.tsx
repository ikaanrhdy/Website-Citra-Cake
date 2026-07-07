import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { m, LazyMotion, domAnimation } from "motion/react";

const ResetPWSuccess = () => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-purple-100 flex flex-col justify-center items-center px-6 py-8"
      >
        {/* Success Icon */}
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="flex flex-col items-center mb-6"
        >
          <CheckCircle className="w-20 h-20 text-green-600 mb-4 animate-bounce-slow" />
          <h1 className="text-2xl font-semibold text-purple-900 font-serif text-center">
            Password Reset Successful
          </h1>
        </m.div>

        {/* Description */}
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="text-gray-600 text-center max-w-xs mb-10 text-sm"
        >
          Your password has been updated successfully. You can now log in with
          your new password.
        </m.p>

        {/* Button Login */}
        <m.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Button
            asChild
            className="w-full max-w-xs bg-purple-900 text-white py-3 rounded-md hover:bg-purple-800 transition"
          >
            <Link to="/login">Back to Login</Link>
          </Button>
        </m.div>
      </m.div>
    </LazyMotion>
  );
};

export default ResetPWSuccess;
