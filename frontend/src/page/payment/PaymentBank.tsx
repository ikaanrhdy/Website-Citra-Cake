import { ArrowLeft, Plus, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";

interface PaymentDetailProps {
  id: number;
  title: string;
  image: string;
}

const PaymentMenuBank: PaymentDetailProps[] = [
  { id: 1, title: "BRI", image: "/bank/bri.png" },
  { id: 2, title: "BNI", image: "/bank/bni.png" },
  { id: 3, title: "BCA", image: "/bank/bca.png" },
];

const PaymentMenuE_wallet: PaymentDetailProps[] = [
  { id: 1, title: "OVO", image: "/bank/ovo.png" },
  { id: 2, title: "GOPAY", image: "/bank/gopay.png" },
  { id: 3, title: "DANA", image: "/bank/dana.png" },
  { id: 4, title: "ShopeePay", image: "/bank/shopee.png" },
];

/* ================= ITEM COMPONENT ================= */

const PaymentItem = ({ image, title }: PaymentDetailProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <img src={image} alt={title} className="w-10 h-10 object-contain" />
    </div>
    <ChevronRight className="text-gray-400" />
  </motion.div>
);

/* ================= MAIN PAGE ================= */

const PaymentBank = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col space-y-4 min-h-screen ">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-2 bg-white px-4 py-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-serif text-lg">Payment</h2>
      </div>

      {/* ===== CONTENT ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 p-4 md:p-6"
      >
        {/* ===== BANK ===== */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs text-gray-400 uppercase">Transfer Bank</h4>

          {/* Bank Lainnya */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-md">
              <Plus size={18} />
            </div>
            <span className="text-sm font-medium">Bank Lainnya</span>
          </motion.div>

          {/* Bank List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PaymentMenuBank.map((item) => (
              <Link to={"/payment/bank/detail"}>
                <PaymentItem key={item.id} {...item} />
              </Link>
            ))}
          </div>
        </div>

        {/* ===== E-WALLET ===== */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs text-gray-400 uppercase">E-Wallet</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PaymentMenuE_wallet.map((item) => (
              <Link to={"/payment/bank/detail"}>
                <PaymentItem key={item.id} {...item} />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentBank;
