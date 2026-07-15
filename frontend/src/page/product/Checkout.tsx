import { useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Store,
  CalendarIcon,
} from "lucide-react";
import { useCartStore } from "@/app/store/useCartProduct";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const paymentMethods = [
  {
    id: "transfer",
    label: "Transfer Bank",
    desc: "Upload bukti setelah transfer",
    icon: CreditCard,
  },
  {
    id: "cod",
    label: "COD (Bayar di Tempat)",
    desc: "Bayar tunai saat pesanan tiba",
    icon: Truck,
  },
  {
    id: "pickup",
    label: "Ambil di Tempat",
    desc: "Ambil langsung di toko Citra Cake",
    icon: Store,
  },
];

const rekeningList = [
  { id: "bca", bank: "BCA", nomor: "1234567890" },
  { id: "bri", bank: "BRI", nomor: "0987654321" },
  { id: "mandiri", bank: "Mandiri", nomor: "1122334455" },
];

const SERVICE_FEE = 1000;

/* ================= TYPES ================= */

interface OrderStateItem {
  id: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  ukuran?: string;
}

interface OrderState {
  orderId?: string;
  fromOrder?: boolean; // true kalau masuk dari "Ubah Pembayaran" di halaman pesanan
  buyNow?: boolean; // true kalau masuk dari "Beli Sekarang" di ProductDetail
  backgroundLocation?: Location;
  items?: OrderStateItem[];
  alamat?: string;
  telepon?: string;
  tanggalKirim?: string;
  catatan?: string;
  subtotalPengiriman?: number;
  biayaLayanan?: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartStore = useCartStore();

  const orderState = location.state as OrderState | null;
  const backgroundLocation = (location.state as any)?.backgroundLocation as
    | Location
    | undefined;

  // ===== STATE ===== (prefill dari orderState kalau datang dari "Ubah Pembayaran")
  const [alamat, setAlamat] = useState(orderState?.alamat ?? "");
  const [telepon, setTelepon] = useState(orderState?.telepon ?? "");
  const [tanggalKirim, setTanggalKirim] = useState<Date | undefined>(
    orderState?.tanggalKirim ? new Date(orderState.tanggalKirim) : undefined,
  );
  const [openCalendar, setOpenCalendar] = useState(false);
  const [catatan, setCatatan] = useState(orderState?.catatan ?? "");
  const [payment, setPayment] = useState("transfer");
  const [selectedBank, setSelectedBank] = useState(rekeningList[0].id);

  // ===== ERROR STATE PER FIELD =====
  const [errors, setErrors] = useState<{
    alamat?: string;
    telepon?: string;
    tanggalKirim?: string;
  }>({});

  // ===== DATA CHECKOUT: dari order lama / buy-now (state) atau dari cart biasa =====
  const cartData = cartStore.getCheckout();

  const data = orderState?.items
    ? {
        items: orderState.items,
        subtotal: orderState.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0,
        ),
      }
    : cartData;

  if (!data || data.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checkout kosong
      </div>
    );
  }

  const shipping = orderState?.subtotalPengiriman ?? 0;
  const serviceFee = orderState?.biayaLayanan ?? SERVICE_FEE;
  const total = data.subtotal + shipping + serviceFee;

  const headerTitle = orderState?.fromOrder
    ? "Ubah Pembayaran"
    : orderState?.buyNow
      ? "Beli Sekarang"
      : "Checkout";

  const handleTeleponChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, "").slice(0, 15);
    setTelepon(onlyDigits);
  };

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!alamat.trim()) {
      nextErrors.alamat = "Alamat pengiriman wajib diisi";
    } else if (alamat.trim().length < 10) {
      nextErrors.alamat = "Alamat terlalu pendek, tulis lebih lengkap";
    }

    if (!telepon.trim()) {
      nextErrors.telepon = "Nomor telepon wajib diisi";
    } else if (!/^\d+$/.test(telepon)) {
      nextErrors.telepon = "Nomor telepon hanya boleh berisi angka";
    } else if (telepon.length < 9) {
      nextErrors.telepon = "Nomor telepon tidak valid";
    }

    if (!tanggalKirim) {
      nextErrors.tanggalKirim = "Tanggal pengiriman wajib diisi";
    } else {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      if (tanggalKirim < todayStart) {
        nextErrors.tanggalKirim = "Tanggal tidak boleh kurang dari hari ini";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Mohon perbaiki data pengiriman yang belum sesuai");
      return;
    }

    if (payment === "transfer" && !selectedBank) {
      toast.error("Pilih rekening tujuan transfer terlebih dahulu");
      return;
    }

    // ===== Mode "Ubah Pembayaran" dari pesanan yang sudah ada =====
    if (orderState?.fromOrder) {
      toast.success("Metode pembayaran berhasil diubah (dummy)");
      navigate("/belum-bayar"); // sesuaikan dengan route detail pesanan kamu
      return;
    }

    if (orderState?.buyNow) {
      toast.success("Pesanan dibuat (dummy)");
      cartStore.clearCheckout();
      if (backgroundLocation) {
        navigate(-1);
        return;
      }
      navigate("/home");
      return;
    }

    // ===== Mode checkout biasa dari keranjang =====
    toast.success("Pesanan dibuat (dummy)");
    cartStore.clearCart();
    cartStore.clearCheckout();
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-medium">{headerTitle}</h2>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 space-y-3 p-4 max-w-4xl mx-auto w-full">
        {/* ===== PRODUCT ===== */}
        <div className="bg-white border rounded-md divide-y">
          {data.items.map((item, i) => (
            <div key={item.id ?? i} className="p-4 flex gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover border rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                {"ukuran" in item && item.ukuran && (
                  <p className="text-xs text-gray-400">Uk. {item.ukuran}</p>
                )}
                <p className="text-sm font-semibold mt-1">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
              <p className="text-xs text-gray-500 shrink-0">x{item.qty}</p>
            </div>
          ))}
        </div>

        {/* ===== FORM PENGIRIMAN ===== */}
        <div className="bg-white border rounded-md p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">
              Alamat Pengiriman <span className="text-red-500">*</span>
            </label>
            <textarea
              value={alamat}
              onChange={(e) => {
                setAlamat(e.target.value);
                if (errors.alamat)
                  setErrors((p) => ({ ...p, alamat: undefined }));
              }}
              placeholder="Masukan alamat lengkap (nama jalan, RT/RW, kecamatan, kota)..."
              rows={3}
              className={`mt-1 w-full text-sm border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 ${
                errors.alamat
                  ? "border-red-400 focus:ring-red-400"
                  : "focus:ring-primary"
              }`}
            />
            {errors.alamat && (
              <p className="text-xs text-red-500 mt-1">{errors.alamat}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={telepon}
              onChange={(e) => {
                handleTeleponChange(e.target.value);
                if (errors.telepon)
                  setErrors((p) => ({ ...p, telepon: undefined }));
              }}
              placeholder="08xxxxxxxxxx"
              className={`mt-1 w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                errors.telepon
                  ? "border-red-400 focus:ring-red-400"
                  : "focus:ring-primary"
              }`}
            />
            {errors.telepon && (
              <p className="text-xs text-red-500 mt-1">{errors.telepon}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Tanggal Pengiriman <span className="text-red-500">*</span>
            </label>
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={`mt-1 w-full justify-start text-left text-sm font-normal ${
                    errors.tanggalKirim ? "border-red-400" : "border-input"
                  } ${!tanggalKirim ? "text-muted-foreground" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggalKirim
                    ? format(tanggalKirim, "dd MMMM yyyy", {
                        locale: idLocale,
                      })
                    : "Pilih tanggal pengiriman"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggalKirim}
                  onSelect={(date) => {
                    setTanggalKirim(date);
                    setOpenCalendar(false);
                    if (errors.tanggalKirim)
                      setErrors((p) => ({ ...p, tanggalKirim: undefined }));
                  }}
                  disabled={(date) => {
                    const todayStart = new Date();
                    todayStart.setHours(0, 0, 0, 0);
                    return date < todayStart;
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.tanggalKirim && (
              <p className="text-xs text-red-500 mt-1">{errors.tanggalKirim}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Catatan <span className="text-gray-400">(Opsional)</span>
            </label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan untuk pesanan..."
              className="mt-1 w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* ===== METODE PEMBAYARAN ===== */}
        <div className="bg-white border rounded-md p-4 space-y-3">
          <p className="font-medium">Metode Pembayaran</p>

          {paymentMethods.map((m) => {
            const Icon = m.icon;
            const active = payment === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayment(m.id)}
                className={`w-full rounded-md p-4 flex items-center gap-3 text-left transition cursor-pointer border ${
                  active
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`p-2 rounded-md shrink-0 ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.label}</p>
                  <p
                    className={`text-xs ${
                      active ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {m.desc}
                  </p>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                    active ? "border-white" : "border-gray-300"
                  }`}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}

          {/* ===== INFO TAMBAHAN PER METODE ===== */}
          <AnimatePresence mode="wait">
            {payment === "transfer" && (
              <motion.div
                key="transfer-info"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-primary/10 rounded-md p-4 space-y-3">
                  <p className="text-sm font-medium text-primary">
                    Pilih rekening tujuan:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {rekeningList.map((r) => {
                      const bankActive = selectedBank === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedBank(r.id)}
                          className={`rounded-md border px-3 py-2 text-left transition cursor-pointer ${
                            bankActive
                              ? "bg-primary border-primary text-white"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <p className="text-xs font-semibold">{r.bank}</p>
                          <p
                            className={`text-xs ${
                              bankActive ? "text-white/80" : "text-gray-600"
                            }`}
                          >
                            {r.nomor}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-primary italic">
                    Setelah memesan, Anda akan diarahkan ke halaman upload bukti
                    transfer.
                  </p>
                </div>
              </motion.div>
            )}

            {payment === "cod" && (
              <motion.div
                key="cod-info"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-primary/10 rounded-md p-4 space-y-1">
                  <p className="text-sm font-medium text-primary">
                    COD (Bayar di Tempat):
                  </p>
                  <p className="text-xs text-primary italic">
                    Siapkan uang tunai Rp. {total.toLocaleString("id-ID")} saat
                    pesanan tiba.
                  </p>
                </div>
              </motion.div>
            )}

            {payment === "pickup" && (
              <motion.div
                key="pickup-info"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-primary/10 rounded-md p-4 space-y-1">
                  <p className="text-sm font-medium text-primary">
                    Alamat Toko
                  </p>
                  <p className="text-xs text-primary leading-relaxed">
                    Jl. Al Barokah, RT 03/ RW 01
                    <br />
                    Desa Sidamulih, Kecamatan Rawalo, Kabupaten Banyumas
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== SUMMARY ===== */}
        <div className="bg-white border rounded-md p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total {data.items.length} Produk</span>
            <span>Rp {data.subtotal.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span>Subtotal Pengiriman</span>
            <span>Rp {shipping.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span>Biaya Layanan</span>
            <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-base">
            <span>Total Pembayaran</span>
            <span className="text-primary">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-primary text-white py-3 rounded-md cursor-pointer shadow-md font-medium"
          onClick={handleSubmit}
        >
          {orderState?.fromOrder ? "Simpan Perubahan" : "Buat Pesanan"}
        </motion.button>
      </div>
    </div>
  );
};

export default Checkout;
