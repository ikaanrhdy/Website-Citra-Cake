import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { m, LazyMotion, domAnimation } from "motion/react"; // <- versi motion/react terbaru
import { Link } from "react-router";

// === ZOD SCHEMA ===
const fbSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type FBForm = z.infer<typeof fbSchema>;

const FBScreenAdmin = () => {
  const [showPass, setShowPass] = useState(false);

  const form = useForm<FBForm>({
    resolver: zodResolver(fbSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FBForm) => {
    console.log("Form Submitted:", values);
  };

  // Stagger variant
  const formVariant = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const fieldVariant = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-purple-100 flex flex-col justify-between px-6 py-6"
      >
        {/* Logo */}
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="flex justify-center mt-6 md:mt-10"
        >
          <m.img
            src="/logo/fb.png"
            alt="fb"
            className="w-20 h-20 md:w-28 md:h-28"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </m.div>

        {/* FORM */}
        <m.div
          variants={formVariant}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center mt-10 md:mt-12"
        >
          <h1 className="text-xl font-semibold text-purple-900 mb-6 md:text-2xl">
            Login with Facebook
          </h1>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-5"
          >
            {/* Email */}
            <m.div variants={fieldVariant}>
              <label className="text-sm text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                {...form.register("email")}
                placeholder="Enter your email"
                className="bg-white border-purple-300 focus-visible:ring-purple-600 transition-all duration-300"
              />
              {form.formState.errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </m.div>

            {/* Password */}
            <m.div variants={fieldVariant}>
              <label className="text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="Enter your password"
                  className="bg-white border-purple-300 focus-visible:ring-purple-600 pr-10 transition-all duration-300"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPass ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              {form.formState.errors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </m.div>

            {/* Login Button */}
            <m.div
              variants={fieldVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                asChild
                className="w-full bg-purple-900 text-white hover:bg-purple-800 transition cursor-pointer"
              >
                <Link to="/admin">Login</Link>
              </Button>
            </m.div>
          </form>
        </m.div>

        {/* Brand Logo */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-6 md:mb-10"
        >
          <m.img
            src="/logo/logo.png"
            alt="brand"
            className="w-32 opacity-80"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </m.div>
      </m.div>
    </LazyMotion>
  );
};

export default FBScreenAdmin;
