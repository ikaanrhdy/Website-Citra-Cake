import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
// store
import useAuthStore from "@/app/store/auth";
// firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/utils/firebaseError";
// toast
import { toast } from "sonner";
// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// icons
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ChevronLeft,
  Loader2,
} from "lucide-react";

// motion
import { m, LazyMotion, domAnimation } from "motion/react";

// ======================
// VALIDATION SCHEMA
// ======================
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Email is invalid" }),
    phoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 10, {
        message: "Phone number is invalid",
      }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const formVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 140, damping: 16 },
  },
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isLoading, setLoading, setError } = useAuthStore();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);
      await createUserWithEmailAndPassword(auth, data.email, data.password);
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
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen w-full bg-purple-100 flex lg:items-stretch">
        {/* LEFT — Branding panel (tablet & desktop only) */}
        <m.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex md:w-1/2 lg:w-3/5 flex-col justify-center items-center bg-purple-900 text-white p-10 relative overflow-hidden"
        >
          <m.img
            src="/logo/logo.png"
            alt="Logo"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="max-h-64 object-contain mb-8 relative z-10"
          />
          <h2 className="text-3xl lg:text-4xl font-bold text-center relative z-10">
            Create Account
          </h2>
          <p className="text-purple-200 mt-2 text-center max-w-sm relative z-10">
            Daftar sekarang dan mulai pengalamanmu bersama kami.
          </p>

          {/* decorative blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-700/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl" />
        </m.div>

        {/* RIGHT — Form */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center px-6 py-10 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Back button */}
            <m.button
              type="button"
              onClick={() => navigate(-1)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-gray-700 hover:text-gray-900 transition cursor-pointer"
            >
              <ChevronLeft size={26} />
            </m.button>

            {/* HEADER (mobile only) */}
            <m.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center mt-4 mb-6 md:hidden"
            >
              <h1 className="text-2xl font-bold font-roboto text-gray-900">
                Create Account
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Isi data diri kamu untuk mendaftar
              </p>
            </m.div>

            {/* HEADER (desktop/tablet only) */}
            <m.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="hidden md:block mb-6"
            >
              <h1 className="text-2xl lg:text-3xl font-bold font-roboto text-gray-900">
                Register
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Lengkapi formulir berikut untuk membuat akun baru
              </p>
            </m.div>

            {/* FORM */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <m.div variants={formVariant} initial="hidden" animate="show">
                  <div className="space-y-5">
                    {/* NAME + PHONE — 2 kolom mulai sm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* NAME */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <m.div variants={fieldVariant}>
                              <FormLabel>
                                <span className="text-sm font-semibold text-gray-900">
                                  Name
                                </span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative bg-white rounded-xl border border-gray-200">
                                  <User
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                                  />
                                  <Input
                                    placeholder="Enter your name"
                                    className="pl-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </m.div>
                          </FormItem>
                        )}
                      />

                      {/* PHONE */}
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <m.div variants={fieldVariant}>
                              <FormLabel>
                                <span className="text-sm font-semibold text-gray-900">
                                  Phone Number
                                </span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative bg-white rounded-xl border border-gray-200">
                                  <Phone
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                                  />
                                  <Input
                                    placeholder="Enter your phone number"
                                    className="pl-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </m.div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* EMAIL */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <m.div variants={fieldVariant}>
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
                                  placeholder="Enter your email"
                                  type="email"
                                  className="pl-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </m.div>
                        </FormItem>
                      )}
                    />

                    {/* PASSWORD + CONFIRM — 2 kolom mulai sm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* PASSWORD */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <m.div variants={fieldVariant}>
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
                                    placeholder="Enter your password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                            </m.div>
                          </FormItem>
                        )}
                      />

                      {/* CONFIRM PASSWORD */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <m.div variants={fieldVariant}>
                              <FormLabel>
                                <span className="text-sm font-semibold text-gray-900">
                                  Confirm Password
                                </span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative bg-white rounded-xl border border-gray-200">
                                  <Lock
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                                  />
                                  <Input
                                    placeholder="Confirm your password"
                                    type={showConfirm ? "text" : "password"}
                                    className="pl-10 pr-10 h-12 border-0 rounded-xl focus-visible:ring-0"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                                  >
                                    {showConfirm ? (
                                      <EyeOff size={18} />
                                    ) : (
                                      <Eye size={18} />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </m.div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* TERMS */}
                    <m.div
                      variants={fieldVariant}
                      className="flex items-center gap-2.5 pt-1"
                    >
                      <Checkbox
                        id="terms"
                        className="bg-gray-300 border-2 border-gray-400 w-4 h-4"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </m.div>

                    {/* SUBMIT BUTTON */}
                    <m.div
                      variants={fieldVariant}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-2"
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-900 text-base h-12 font-medium rounded-xl hover:bg-purple-800 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Mendaftar...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </m.div>

                    {/* LOGIN LINK */}
                    <m.div
                      variants={fieldVariant}
                      className="flex justify-center"
                    >
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-purple-700 font-medium hover:text-purple-900 transition"
                        >
                          Log In
                        </Link>
                      </p>
                    </m.div>
                  </div>
                </m.div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
};

export default Register;
