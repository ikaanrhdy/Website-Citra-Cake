import { useState } from "react";
import { RiQrScan2Line, RiWalletLine } from "react-icons/ri";
import { BsBank } from "react-icons/bs";
import { IoIosWallet } from "react-icons/io";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { Scanner } from "@yudiel/react-qr-scanner";

const Payment = () => {
  const [showQR, setShowQR] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const qrValue = "https://example.com/payment/123";

  const menu = [
    {
      name: "E-Wallet",
      icon: <IoIosWallet size={30} />,
      path: "/payment/bank",
    },
    {
      name: "QR Code",
      icon: <RiQrScan2Line size={30} />,
      action: () => setShowQR((prev) => !prev),
    },
    {
      name: "Kirim Ke Bank",
      icon: <BsBank size={30} />,
      path: "/payment/bank",
    },
  ];

  return (
    <div className="flex flex-col space-y-4 px-4 md:px-8 lg:px-16">
      {/* ===== HEADING ===== */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-medium font-serif"
      >
        Dompet
      </motion.h1>

      {/* ===== SALDO CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-[#DFA9F8] w-full max-w-xs p-4 shadow-md shadow-black/40 md:flex-row md:justify-between md:items-center md:max-w-full md:p-6 rounded-lg"
      >
        <div>
          <div className="flex items-center space-x-2">
            <RiWalletLine />
            <h5 className="text-xs md:text-sm font-serif">Saldo</h5>
          </div>
          <h3 className="font-serif text-sm md:text-lg pt-2">Rp. 2.895.679</h3>
        </div>
        <RiWalletLine className="hidden md:block w-12 h-12 opacity-30" />
      </motion.div>

      {/* ===== PAYMENT MENU ===== */}
      <div className="flex flex-wrap justify-center gap-8 py-3 border bg-white rounded-lg">
        {menu.map((item) => {
          const content = (
            <>
              <div
                className={`${
                  item.name === "QR Code" && showQR
                    ? "text-purple-700"
                    : "text-primary"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-xs md:text-sm font-serif">{item.name}</span>
            </>
          );

          return (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center cursor-pointer select-none"
            >
              {item.path ? (
                <Link to={item.path} className="flex flex-col items-center">
                  {content}
                </Link>
              ) : (
                <div
                  onClick={item.action}
                  className="flex flex-col items-center"
                >
                  {content}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ===== QR SECTION (TOGGLE AREA) ===== */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl p-4 mt-2 space-y-6">
              {/* === GENERATE QR === */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm">QR Pembayaran</h4>
                <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
                  <QRCode value={qrValue} size={180} />
                </div>
              </div>

              {/* === SCAN QR === */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm">Scan QR</h4>

                <div className="overflow-hidden rounded-lg border">
                  <Scanner
                    onScan={(result) => {
                      if (result?.[0]?.rawValue) {
                        setScanResult(result[0].rawValue);
                      }
                    }}
                    onError={(err) => console.error(err)}
                  />
                </div>

                {scanResult && (
                  <div className="text-xs bg-gray-100 p-2 rounded">
                    <span className="text-gray-500">Hasil Scan:</span>
                    <p className="font-medium break-all">{scanResult}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;
