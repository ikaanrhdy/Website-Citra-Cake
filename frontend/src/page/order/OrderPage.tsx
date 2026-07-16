import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { useSearchParams } from "react-router";
import OrderContent from "./OrderContent";
import { useUserLayoutContext } from "@/layout/userLayoutContext";

const TABS = [
  "Belum Bayar",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Pengembalian",
  "Dibatalkan",
] as const;

type TabType = (typeof TABS)[number];

// id per tab, dipakai sebagai key URL (?tab=...) & atribut id tombol
const TAB_IDS: Record<TabType, string> = {
  "Belum Bayar": "belum-bayar",
  Diproses: "diproses",
  Dikirim: "dikirim",
  Selesai: "selesai",
  Pengembalian: "pengembalian",
  Dibatalkan: "dibatalkan",
};

const isValidTab = (value: string | null): value is TabType =>
  TABS.includes(value as TabType);

const OrderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { onOpenSidebar } = useUserLayoutContext();

  // Tab aktif diambil dari URL (?tab=...), bukan dari useState lokal.
  // Jadi kalau user pindah ke halaman lain (rincian, pengembalian, dst) lalu
  // menekan tombol kembali/back browser, dia balik ke tab yang sama, bukan reset.
  const tabParam = searchParams.get("tab");
  const activeTab: TabType = isValidTab(tabParam) ? tabParam : "Belum Bayar";

  const handleTabChange = (tab: TabType) => {
    // replace: true biar klik pindah tab gak numpuk-numpuk di history back
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex items-center gap-2 bg-white p-3 md:p-5 md:px-8 border-b sticky top-0 z-20">
        <button
          onClick={onOpenSidebar}
          className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
        >
          <Menu />
        </button>
        <h2 className="font-medium text-sm md:text-xl">Belanjaan Saya</h2>
      </div>

      <div className="bg-white border-b sticky top-14 md:top-18 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex md:justify-center">
            {TABS.map((tab) => (
              <button
                key={tab}
                id={`tab-${TAB_IDS[tab]}`}
                onClick={() => handleTabChange(tab)}
                className={`relative font-roboto flex-1 md:flex-none px-1 md:px-7 py-3 md:py-4 text-[11px] md:text-base whitespace-nowrap transition cursor-pointer text-center
                ${
                  activeTab === tab
                    ? "text-primary font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-1 right-1 md:left-7 md:right-7 h-0.5 md:h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-12 lg:px-20 py-4 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`tabpanel-${TAB_IDS[activeTab]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <OrderContent status={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderPage;
