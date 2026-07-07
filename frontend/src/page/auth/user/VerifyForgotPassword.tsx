import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Delete } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

const NUMPAD_KEYS = [
  { main: "1", sub: "" },
  { main: "2", sub: "ABC" },
  { main: "3", sub: "DEF" },
  { main: "4", sub: "GHI" },
  { main: "5", sub: "JKL" },
  { main: "6", sub: "MNO" },
  { main: "7", sub: "PQRS" },
  { main: "8", sub: "TUV" },
  { main: "9", sub: "WXYZ" },
];

const VerifyForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    (location.state as { email?: string })?.email ?? "abc@gmail.com";

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setSecondsLeft(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m} : ${s}`;
  };

  const handleNumberPress = (num: string) => {
    setError("");
    const emptyIndex = code.findIndex((c) => c === "");
    if (emptyIndex === -1) return; // semua slot udah keisi

    const newCode = [...code];
    newCode[emptyIndex] = num;
    setCode(newCode);
  };

  const handleDelete = () => {
    setError("");
    const lastFilledIndex = [...code].reverse().findIndex((c) => c !== "");
    if (lastFilledIndex === -1) return; // semua slot kosong

    const indexToClear = CODE_LENGTH - 1 - lastFilledIndex;
    const newCode = [...code];
    newCode[indexToClear] = "";
    setCode(newCode);
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    // TODO: panggil API kirim ulang kode OTP ke email
    setCode(Array(CODE_LENGTH).fill(""));
    setError("");
    startTimer();
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (otp.length < CODE_LENGTH) {
      setError("Masukkan kode 4 digit terlebih dahulu");
      return;
    }

    try {
      setVerifying(true);
      // TODO: panggil API verifikasi OTP di sini
      // contoh: await verifyOtp(email, otp);

      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      setError((err as Error).message || "Kode salah, coba lagi");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-purple-100 flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        {/* Back button */}
        <div className="px-6 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-gray-900 transition cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center px-6 mt-4"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Please check your email
          </h1>
          <p className="text-sm text-gray-500 mt-3">
            We've sent a code to{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </motion.div>

        {/* OTP Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex justify-center gap-3 mt-8 px-6"
        >
          {code.map((digit, i) => (
            <div
              key={i}
              className={`w-14 h-14 rounded-xl bg-white border flex items-center justify-center text-xl font-semibold text-gray-900 transition
                ${digit ? "border-purple-700" : "border-gray-300"}`}
            >
              {digit}
            </div>
          ))}
        </motion.div>

        {error && (
          <p className="text-center text-sm text-red-500 mt-3 px-6">{error}</p>
        )}

        {/* Verify Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="px-6 mt-8"
        >
          <Button
            type="button"
            disabled={verifying}
            onClick={handleVerify}
            className="w-full bg-purple-900 text-base h-12 font-medium rounded-xl hover:bg-purple-800 disabled:opacity-60"
          >
            {verifying ? "Memverifikasi..." : "Verify"}
          </Button>
        </motion.div>

        {/* Resend code */}
        <div className="text-center mt-4 px-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={secondsLeft > 0}
            className={`text-sm transition ${
              secondsLeft > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-purple-700 hover:text-purple-900 cursor-pointer"
            }`}
          >
            Send code again{"  "}
            <span className="font-medium">{formatTime(secondsLeft)}</span>
          </button>
        </div>

        {/* Numpad */}
        <div className=" px-4 pb-6 mt-auto">
          <div className="grid grid-cols-3 gap-3">
            {NUMPAD_KEYS.map((key) => (
              <button
                key={key.main}
                type="button"
                onClick={() => handleNumberPress(key.main)}
                className="bg-white rounded-xl py-3 flex flex-col items-center justify-center hover:bg-gray-50 active:scale-95 transition cursor-pointer"
              >
                <span className="text-lg font-medium text-gray-900">
                  {key.main}
                </span>
                {key.sub && (
                  <span className="text-[10px] tracking-wide text-gray-400">
                    {key.sub}
                  </span>
                )}
              </button>
            ))}

            {/* Bottom row: symbols, 0, delete */}
            <div className="flex items-center justify-center text-gray-400 text-sm">
              + * #
            </div>
            <button
              type="button"
              onClick={() => handleNumberPress("0")}
              className="bg-white rounded-xl py-3 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition cursor-pointer"
            >
              <span className="text-lg font-medium text-gray-900">0</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center hover:bg-gray-50/60 rounded-xl active:scale-95 transition cursor-pointer"
            >
              <Delete size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForgotPassword;
