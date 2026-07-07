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

// icons
import { Eye, EyeOff, User, Lock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import useAuthStore from "@/app/store/auth";
import { dummyAdmins, DUMMY_TOKEN_EXPIRES_IN } from "@/data/adminData";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
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

const LoginAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, setError, setLoading, error, isLoading } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    // simulasi delay request
    setTimeout(() => {
      const found = dummyAdmins.find(
        (a) => a.username === data.username && a.password === data.password,
      );

      if (!found) {
        setError("Username atau password salah");
        setLoading(false);
        return;
      }

      // token dummy — nanti diganti token asli dari response API backend
      const dummyToken = `dummy-token-${found.id}-${Date.now()}`;

      login({
        userId: found.id,
        name: found.name,
        role: found.role,
        userType: "admin",
        token: dummyToken,
        expiresIn: DUMMY_TOKEN_EXPIRES_IN,
      });

      setLoading(false);
      navigate("/admin");
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-purple-100 flex justify-center">
      <div className="w-full max-w-md px-6 pt-6 pb-10">
        {/* Back button */}
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

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center mt-4 mb-8"
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

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <motion.div
              variants={parentVariant}
              initial="hidden"
              animate="show"
            >
              <div className="space-y-5">
                {/* Username */}
                <motion.div variants={childVariant}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-sm font-semibold text-gray-900">
                            Username
                          </span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative bg-white rounded-xl border border-gray-900">
                            <User
                              size={18}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                            />
                            <Input
                              className="pl-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                              placeholder="Enter your username"
                              type="text"
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
                            Password Admin
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
                              placeholder="Password"
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

                {/* Error message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Login Button */}
                <motion.div variants={childVariant} className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-900 text-base h-12 font-medium rounded-xl hover:bg-purple-800 disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? "Memproses..." : "Login as Admin"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginAdmin;
