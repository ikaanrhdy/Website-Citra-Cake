import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useCakeCustomization } from "@/hooks/useCakeCustomization";
import { useCartStore } from "@/app/store/useCartProduct";
import { svgToPngDataUrl } from "@/utils/svgToPNGDataUrl";
import PreviewCake from "@/components/user/Custom/PreviewCake";
import LayerSelector from "@/components/user/Custom/LayerSelector";
import DropdownPilihan from "@/components/user/Custom/DropdownPilihan";
import ReferensiCake from "@/components/user/Custom/ReferensiCake";
import DekorasiSection from "@/components/user/Custom/DekorasiSection";
import UcapanCatatan from "@/components/user/Custom/UcapanCatatan";
import TotalSummary from "@/components/user/Custom/TotalSummary";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="280">
      <rect width="100%" height="100%" fill="#F3E8DC"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#B08968" font-size="16" font-family="sans-serif">Custom Cake</text>
    </svg>`,
  );

const CustomitationWithAi = () => {
  const navigate = useNavigate();
  const state = useCakeCustomization();
  const addCustomCakeToCart = useCartStore((s) => s.addCustomCakeToCart);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (action: "cart" | "buy") => {
    if (!state.isValid) {
      toast.error(
        "Lengkapi semua pilihan kustomisasi (ukuran, layer, base cake, tipe & warna cream)",
      );
      return;
    }

    const totalPrice = state.priceBreakdown.total;

    const { layerLabel, baseCakeLabel, tipeCreamLabel, warnaCreamLabel } =
      state.previewSummary;
    const summary = `${layerLabel} • ${baseCakeLabel} • ${tipeCreamLabel} • ${warnaCreamLabel}`;

    const customFields = {
      ukuran: state.ukuran,
      layer: state.layer,
      baseCake: state.baseCake,
      tipeCream: state.tipeCream,
      warnaCream: state.warnaCream,
      referensi: state.referensi,
      dekorasi: state.dekorasi,
      ucapan: state.ucapan,
      catatanPesanan: state.catatanPesanan,
    };

    // Convert SVG preview jadi PNG data URL, biar gambar cake custom
    // tetap kelihatan pas dibuka lagi di Cart/Checkout (bukan re-render SVG)
    let previewImage = FALLBACK_IMAGE;
    const svgEl = previewRef.current?.querySelector("svg");
    if (svgEl) {
      try {
        previewImage = await svgToPngDataUrl(svgEl as unknown as SVGSVGElement);
      } catch (err) {
        console.error("Gagal convert preview cake jadi gambar:", err);
      }
    }

    if (action === "cart") {
      addCustomCakeToCart({
        title: "Custom Cake",
        image: previewImage,
        price: totalPrice,
        summary,
        customFields,
      });
      toast.success("Custom cake ditambahkan ke keranjang");
      state.reset();
      navigate("/cart");
      return;
    }

    // action === "buy" → langsung ke checkout, skip keranjang.
    // customFields & isCustom ikut dikirim biar Checkout bisa nampilin
    // badge "Custom" + ringkasan, tanpa perlu render ulang SVG-nya.
    toast.success("Lanjut ke pembelian");
    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [
          {
            id: `custom-${Date.now()}`,
            title: "Custom Cake",
            image: previewImage,
            price: totalPrice,
            qty: 1,
            ukuran: summary,
            isCustom: true,
            customFields,
          },
        ],
      },
    });
    state.reset();
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3 bg-gray-50 min-h-screen"
    >
      {/* ================= HEADER ================= */}
      <motion.div
        variants={item}
        className="flex bg-white justify-between px-5 py-3 lg:px-8 items-center shadow-sm sticky top-0 z-20"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100 rounded-full p-2 cursor-pointer"
        >
          <ArrowLeft size={24} />
        </motion.button>
        <h2 className="font-medium text-sm lg:text-base">Custom Cake</h2>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/cart"
            className="hover:bg-primary/10 rounded-full p-2 text-primary cursor-pointer"
          >
            <FaCartShopping size={20} />
          </Link>
        </motion.div>
      </motion.div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="px-4 lg:px-8 pb-28 lg:pb-10 max-w-2xl lg:max-w-6xl mx-auto w-full">
        <div className="lg:grid lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8 lg:items-start">
          {/* ── KIRI (desktop): Preview + Total, sticky ── */}
          <div className="lg:sticky lg:top-20 flex flex-col gap-4 lg:gap-5">
            <motion.div variants={item}>
              <PreviewCake ref={previewRef} state={state} />
            </motion.div>

            {/* Total & tombol aksi cuma tampil di sini pas desktop/tablet */}
            <motion.div variants={item} className="hidden lg:block">
              <TotalSummary state={state} />
            </motion.div>

            <motion.div
              variants={item}
              className="hidden lg:flex flex-col gap-3"
            >
              <Button
                onClick={() => handleSubmit("buy")}
                className="w-full bg-primary text-white cursor-pointer h-11"
              >
                Beli Sekarang
              </Button>
              <Button
                onClick={() => handleSubmit("cart")}
                className="w-full bg-white border text-black cursor-pointer hover:text-white h-11"
              >
                Masukkan Keranjang
              </Button>
            </motion.div>
          </div>

          {/* ── KANAN (desktop): semua opsi kustomisasi ── */}
          <div className="flex flex-col gap-4 mt-4 lg:mt-0">
            {/* LayerSelector sekarang otomatis merender 1 UkuranSelector
                per layer sesuai jumlah layer yang dipilih (1–4) */}
            <motion.div variants={item}>
              <LayerSelector state={state} />
            </motion.div>
            <motion.div variants={item}>
              <DropdownPilihan state={state} />
            </motion.div>
            <motion.div variants={item}>
              <ReferensiCake state={state} />
            </motion.div>
            <motion.div variants={item}>
              <DekorasiSection state={state} />
            </motion.div>
            <motion.div variants={item}>
              <UcapanCatatan state={state} />
            </motion.div>

            {/* Total cuma tampil di sini pas mobile (di kolom kiri udah ada versi desktop) */}
            <motion.div variants={item} className="lg:hidden">
              <TotalSummary state={state} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ACTION (mobile only) ================= */}
      <motion.div
        variants={item}
        className="lg:hidden sticky bottom-0 bg-white border-t p-4 flex flex-row gap-3 max-w-2xl mx-auto w-full"
      >
        <Button
          onClick={() => handleSubmit("cart")}
          className="flex-1 min-w-0 bg-white border text-black cursor-pointer hover:text-white"
        >
          Masukkan Keranjang
        </Button>
        <Button
          onClick={() => handleSubmit("buy")}
          className="flex-1 min-w-0 bg-primary text-white cursor-pointer"
        >
          Beli Sekarang
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CustomitationWithAi;
