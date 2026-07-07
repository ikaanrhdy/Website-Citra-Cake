import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { m, LazyMotion, domAnimation } from "motion/react";

const ForgotPassword = () => {
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

        <div className="flex flex-col items-center justify-center flex-1">
          {/* Title + subtitle with stagger */}
          <m.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="flex flex-col items-center"
          >
            <m.h1
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 100 },
                },
              }}
              className="text-2xl font-semibold mb-2 text-purple-900 font-serif"
            >
              Forgot Password?
            </m.h1>

            <m.p
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 100 },
                },
              }}
              className="text-sm text-gray-600 mb-8 max-w-xs text-center"
            >
              Please enter the email associated with your account.
            </m.p>
          </m.div>

          {/* Form */}
          <form className="w-full max-w-xs space-y-5">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <label className="text-sm text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white border-purple-300 focus-visible:ring-purple-600"
                required
              />
            </m.div>

            <m.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                asChild
                className="w-full bg-purple-900 text-white py-3 rounded-md hover:bg-purple-800 transition cursor-pointer"
              >
                <Link to="/reset-password-verify">Send Code</Link>
              </Button>
            </m.div>
          </form>

          {/* Footer */}
          <m.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
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

export default ForgotPassword;
