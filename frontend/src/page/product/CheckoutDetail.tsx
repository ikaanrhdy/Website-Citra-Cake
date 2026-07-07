import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, MapPin } from "lucide-react";

const paymentLabels: Record<string, string> = {
  transfer: "Transfer Bank",
  cod: "COD (Bayar di Tempat)",
  pickup: "Ambil di Tempat",
};

const CheckoutDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Data tidak ditemukan
      </div>
    );
  }

  const {
    item,
    subtotal,
    shipping,
    serviceFee,
    nama,
    alamat,
    telepon,
    payment,
    bankName,
  } = state;

  const total = subtotal + shipping + serviceFee;
  const paymentLabel = paymentLabels[payment] ?? payment;

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
        <h2 className="font-medium">Detail Checkout</h2>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 space-y-3 p-4 max-w-3xl mx-auto w-full">
        {/* ===== ALAMAT PENGIRIMAN ===== */}
        <div className="bg-white p-4 rounded-md border space-y-2">
          <p className="text-sm font-semibold">Alamat Pengiriman</p>
          <div className="flex gap-2">
            <MapPin className="text-primary shrink-0 mt-0.5" size={16} />
            <div className="text-sm space-y-0.5">
              <p>
                <span className="font-medium">{nama || "Tidak diisi"}</span>{" "}
                <span className="text-gray-500">
                  ({telepon || "Tidak diisi"})
                </span>
              </p>
              <p className="text-gray-500">{alamat || "Tidak diisi"}</p>
            </div>
          </div>
        </div>

        {/* ===== PRODUCT ===== */}
        <div className="bg-white p-4 rounded-md border flex items-center gap-4">
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 object-cover border rounded-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-1">{item.title}</p>
            <p className="text-sm font-semibold mt-1">
              Rp {item.price.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-xs text-gray-500 shrink-0">x{item.qty}</p>
        </div>

        {/* ===== SUMMARY ===== */}
        <div className="bg-white rounded-md border overflow-hidden text-sm">
          <div className="p-4 space-y-2">
            <div className="flex justify-between">
              <span>Total `1 Produk</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal Pengiriman</span>
              <span>Rp {shipping.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan</span>
              <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Pembayaran</span>
              <span>
                {paymentLabel}
                {payment === "transfer" && bankName ? ` • ${bankName}` : ""}
              </span>
            </div>
          </div>

          <div className="bg-primary/10 px-4 py-3 flex justify-between font-semibold">
            <span>Total Pembayaran</span>
            <span className="text-primary">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetail;
