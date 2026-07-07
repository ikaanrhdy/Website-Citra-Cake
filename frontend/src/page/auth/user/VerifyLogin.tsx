import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "motion/react";

const VerifyLogin = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    const v = value.slice(0, 1);
    if (v && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleBackspace = (value: string, index: number) => {
    if (!value && index > 0) inputsRef.current[index - 1]?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-purple-100 flex flex-col px-6 py-4 relative"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-purple-200 transition cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 text-purple-800" />
      </motion.button>

      <div className="flex flex-col items-center justify-center flex-1">
        <motion.h1
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold mb-2 text-purple-900 font-serif"
        >
          Please Check Your email
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 mb-8 max-w-xs"
        >
          We've sent a code to abc@gmail.com
        </motion.p>

        {/* OTP input fields */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="flex justify-center gap-4 mb-8"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 5 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
            >
              <Input
                maxLength={1}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-semibold border-purple-300 focus-visible:ring-purple-600"
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace")
                    handleBackspace((e.target as HTMLInputElement).value, i);
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Verify button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring" }}
        >
          <Button
            asChild
            className="w-full max-w-xs bg-purple-900 text-white py-3 rounded-md hover:bg-purple-800 transition cursor-pointer"
          >
            <Link to="/home">Verify</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 mt-4"
        >
          Didn't receive the code?{" "}
          <button className="text-purple-700 hover:underline cursor-pointer">
            Resend
          </button>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default VerifyLogin;
