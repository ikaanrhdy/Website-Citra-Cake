import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/app/store/useCartProduct";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();

  // ambil data dari store
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const checkout = useCartStore((state) => state.checkout);

  // state checkbox
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectedItems = items.filter((item) => selected.includes(item.id));

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const totalQty = selectedItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex bg-white p-3 md:px-6 items-center justify-between border-b"
      >
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
          >
            <ArrowLeft />
          </button>

          <div className="flex items-center gap-1">
            <h2 className="font-medium text-sm md:text-base">Keranjang Saya</h2>
            <span className="text-xs text-gray-500">({items.length})</span>
          </div>
        </div>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-auto">
        <div className="mx-4 my-5 md:mx-10 lg:max-w-4xl lg:mx-auto bg-white rounded-md border p-4 md:p-6">
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="flex gap-4 md:gap-6 items-center"
              >
                {/* Checkbox */}
                <Checkbox
                  checked={selected.includes(item.id)}
                  onCheckedChange={() => toggleSelect(item.id)}
                  className="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
                />

                {/* Image */}
                <div className="flex items-center justify-center border rounded-md p-1 w-16 h-16 md:w-20 md:h-20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 flex-1">
                  <h3 className="font-medium text-sm md:text-base">
                    {item.title}
                  </h3>
                  {item.size && (
                    <div className="w-fit text-[8px] md:text-[10px] px-3 py-0.5 bg-gray-100 border rounded">
                      Size: {item.size}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <span className="text-[9px] md:text-sm text-red-500">
                      Rp {(item.finalPrice * item.qty).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center border rounded-md overflow-hidden text-xs md:text-sm">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-2 md:px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => decreaseQty(item.id, item.selectedSize)}
                  >
                    −
                  </motion.button>

                  <div className="px-3 min-w-6 text-center font-medium">
                    {item.qty}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-2 md:px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => increaseQty(item.id, item.selectedSize)}
                  >
                    +
                  </motion.button>
                </div>

                {/* Remove */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    removeFromCart(item.id, item.selectedSize);
                    toast.success("Produk dihapus dari keranjang");
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer transition"
                  title="Hapus produk"
                >
                  <Trash2 size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky bottom-0 bg-white border-t px-4 md:px-10 py-3 flex justify-between items-center shadow"
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selected.length === items.length}
            onCheckedChange={(checked) =>
              setSelected(checked ? items.map((i) => i.id) : [])
            }
          />
          <span className="text-sm font-medium">Semua</span>
        </div>

        <div className="text-right">
          <p className="text-[10px] md:text-sm">
            Total{" "}
            <span className="text-red-500 font-semibold">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </p>
          <p className="text-[9px] md:text-xs text-gray-500">
            {totalQty > 0 && `${totalQty} item`}
          </p>
        </div>

        <motion.button
          disabled={selectedItems.length === 0}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => {
            if (selectedItems.length === 0) {
              toast.error("Pilih produk terlebih dahulu!");
              return;
            }

            checkout(selectedItems);
            navigate("/checkout", {
              state: { items: selectedItems, totalPrice },
            });
          }}
          className="bg-primary disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
        >
          Checkout ({selectedItems.length})
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Cart;
