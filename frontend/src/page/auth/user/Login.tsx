import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// icons
import { Eye, EyeOff, Mail, Lock, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import useAuthStore from "@/app/store/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuthErrorMessage } from "@/utils/firebaseError";
import { auth } from "@/lib/firebase";

const formSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const parentVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const childVariant = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, setLoading, setError } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);

      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/2fa");
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-purple-100 flex lg:items-stretch">
      {/* LEFT — Branding panel (tablet & desktop only) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 lg:w-3/5 flex-col justify-center items-center text-white p-10 relative overflow-hidden"
      >
        <motion.img
          src="/logo/logo.png"
          alt="Logo"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="max-h-64 object-contain mb-8 relative z-10"
        />
        <h2 className="text-3xl lg:text-4xl font-bold text-center relative z-10 text-gray-700">
          Welcome Back!
        </h2>
        <p className="text-gray-700 mt-2 text-center max-w-sm relative z-10">
          Glad to See You Again! Login to continue where you left off.
        </p>

        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/40 rounded-full blur-3xl" />
      </motion.div>

      {/* RIGHT — Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center items-center px-6 py-10">
        <div className="w-full max-w-md">
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-gray-700 hover:text-gray-900 transition cursor-pointer"
          >
            <ChevronLeft size={26} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center mt-4 mb-8 md:hidden"
          >
            <h1 className="text-2xl font-bold font-roboto text-gray-900">
              Welcome Back!
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-sm text-gray-500 mt-1"
            >
              Glad to See You Again!
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden md:block mb-8"
          >
            <h1 className="text-2xl lg:text-3xl font-bold font-roboto text-gray-900">
              Login
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Masukkan email dan password kamu untuk melanjutkan
            </p>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <motion.div
                variants={parentVariant}
                initial="hidden"
                animate="show"
              >
                <div className="space-y-5">
                  {/* Email */}
                  <motion.div variants={childVariant}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-sm font-semibold text-gray-900">
                              Email
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative bg-white rounded-xl border border-gray-200">
                              <Mail
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                              />
                              <Input
                                className="pl-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                                placeholder="Enter your email"
                                type="email"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={childVariant}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-sm font-semibold text-gray-900">
                              Password
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative bg-white rounded-xl border border-gray-200">
                              <Lock
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                              />
                              <Input
                                className="pl-10 pr-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                disabled={isLoading}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                              >
                                {showPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Forgot password */}
                  <motion.div variants={childVariant}>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-purple-700 hover:text-purple-900 transition"
                    >
                      forgot password?
                    </Link>
                  </motion.div>

                  {/* Login Button */}
                  <motion.div variants={childVariant} className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-purple-900 text-base h-12 font-medium rounded-xl hover:bg-purple-800 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </motion.div>

                  {/* Register */}
                  <motion.div
                    variants={childVariant}
                    className="flex justify-center"
                  >
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-purple-700 font-medium hover:text-purple-900 transition"
                      >
                        Register
                      </Link>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
