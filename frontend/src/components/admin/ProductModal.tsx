import { useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { productsAdmin, ProductSize } from "@/types/data";
import { X, Plus, Trash2, Upload, Link } from "lucide-react";

interface ProductModalProps {
  initialData: productsAdmin | null;
  onClose: () => void;
  onSave: (
    data: Omit<productsAdmin, "id" | "rating" | "reviews"> & {
      discountType?: "percentage" | "nominal";
      discountValue?: number;
      availabilityType?: "ready" | "preorder";
    },
    id?: string,
  ) => void;
}

export const ProductModal = ({
  initialData,
  onClose,
  onSave,
}: ProductModalProps) => {
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    image: initialData?.image ?? "",
    price: initialData?.price ?? 0,
    category: initialData?.category ?? "",
    size: initialData?.size ?? ([] as string[]),
    variant: initialData?.variant ?? ([] as string[]),
    stock: initialData?.stock ?? 0,
    note: initialData?.note ?? "",
  });

  const [imageType, setImageType] = useState<"url" | "file">("url");
  const [availabilityType, setAvailabilityType] = useState<
    "ready" | "preorder"
  >("ready");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "nominal">(
    "percentage",
  );
  const [discountValue, setDiscountValue] = useState(0);

  // Ukuran: array of ProductSize
  const [sizes, setSizes] = useState<ProductSize[]>(initialData?.size ?? []);

  // Varian: array of string
  const [variants, setVariants] = useState<string[]>(
    initialData?.variant ?? [],
  );
  const [variantInput, setVariantInput] = useState("");

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string")
          updateField("image", reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addSize = () => setSizes((prev) => [...prev, { label: "", price: 0 }]);

  const updateSize = (
    i: number,
    field: keyof ProductSize,
    val: string | number,
  ) =>
    setSizes((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
    );

  const removeSize = (i: number) =>
    setSizes((prev) => prev.filter((_, idx) => idx !== i));

  const addVariant = () => {
    const trimmed = variantInput.trim();
    if (trimmed && !variants.includes(trimmed)) {
      setVariants((prev) => [...prev, trimmed]);
      setVariantInput("");
    }
  };

  const removeVariant = (v: string) =>
    setVariants((prev) => prev.filter((x) => x !== v));

  const handleSave = () => {
    if (variants.length < 3) {
      alert("Minimal ada 3 varian");
      return;
    }
    onSave(
      {
        ...form,
        size: sizes,
        variant: variants,
        discountType: hasDiscount ? discountType : undefined,
        discountValue: hasDiscount ? discountValue : undefined,
        availabilityType,
      },
      initialData?.id,
    );
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4"
      >
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-1">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {initialData ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Lengkapi semua informasi produk dengan benar
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition mt-0.5"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 pb-5 flex flex-col gap-4 mt-3">
            {/* ── Informasi Produk ── */}
            <Section title="Informasi Produk">
              <Field label="Nama Produk" required>
                <input
                  placeholder="Contoh, Black Forest Cake Premium..."
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Kategori">
                <input
                  placeholder="Coro"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Harga Dasar" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="160.000"
                    value={form.price === 0 ? "" : form.price}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^0+/, "");
                      updateField("price", val === "" ? 0 : Number(val));
                    }}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Deskripsi">
                <textarea
                  placeholder="Deskripsikan produk secara detail..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </Section>

            {/* ── Gambar Produk ── */}
            <Section title="Gambar Produk">
              <div className="flex gap-2">
                <button
                  onClick={() => setImageType("url")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition
                    ${
                      imageType === "url"
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    }`}
                >
                  <Link size={14} /> URL Link
                </button>
                <button
                  onClick={() => setImageType("file")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition
                    ${
                      imageType === "file"
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    }`}
                >
                  <Upload size={14} /> Upload File
                </button>
              </div>

              {imageType === "url" ? (
                <input
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  className={inputCls}
                />
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-5 cursor-pointer hover:border-primary transition">
                  <Upload size={20} className="text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">
                    Klik untuk upload gambar
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}

              {form.image && imageType === "url" && (
                <img
                  src={form.image}
                  alt="preview"
                  className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                />
              )}
            </Section>

            {/* ── Ukuran Produk ── */}
            <Section
              title="Ukuran Produk"
              action={
                <button
                  onClick={addSize}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition"
                >
                  <Plus size={14} /> Tambah
                </button>
              }
            >
              {sizes.length === 0 && (
                <p className="text-xs text-gray-400">
                  Belum ada ukuran. Klik "+ Tambah".
                </p>
              )}
              {sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    placeholder="Ukuran (contoh: L)"
                    value={s.label}
                    onChange={(e) => updateSize(i, "label", e.target.value)}
                    className={`${inputCls} flex-1`}
                  />
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Harga"
                      value={s.price === 0 ? "" : s.price}
                      onChange={(e) =>
                        updateSize(i, "price", Number(e.target.value))
                      }
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  <button
                    onClick={() => removeSize(i)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </Section>

            {/* ── Varian Rasa ── */}
            <Section
              title="Varian Rasa"
              action={
                <button
                  onClick={addVariant}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition"
                >
                  <Plus size={14} /> Tambah
                </button>
              }
            >
              <input
                placeholder="Varian (Cokelat, Vanilla, Strawberry)"
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addVariant()}
                className={inputCls}
              />
              {variants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <span
                      key={v}
                      className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {v}
                      <button
                        onClick={() => removeVariant(v)}
                        className="hover:text-red-500 transition"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400">
                Minimal 3 varian. Tekan Enter atau klik "+ Tambah".
              </p>
            </Section>

            {/* ── Stok & Ketersediaan ── */}
            <Section title="Stok & Ketersediaan">
              <Field label="Tipe Ketersediaan" required>
                <div className="flex gap-2">
                  {(["ready", "preorder"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAvailabilityType(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                        ${
                          availabilityType === t
                            ? "bg-primary text-white border-primary"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                        }`}
                    >
                      {t === "ready" ? "Ready Stok" : "Pre-Order"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Jumlah Stok" required>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock === 0 ? "" : form.stock}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+/, "");
                    updateField("stock", val === "" ? 0 : Number(val));
                  }}
                  className={inputCls}
                />
              </Field>
            </Section>

            {/* ── Potongan Harga ── */}
            <Section
              title="Potongan Harga"
              action={
                <Toggle
                  enabled={hasDiscount}
                  onToggle={() => setHasDiscount((v) => !v)}
                />
              }
            >
              <AnimatePresence>
                {hasDiscount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-3 overflow-hidden"
                  >
                    <Field label="Tipe Diskon" required>
                      <div className="flex gap-2">
                        {(["percentage", "nominal"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setDiscountType(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                              ${
                                discountType === t
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                              }`}
                          >
                            {t === "percentage"
                              ? "Persentase (%)"
                              : "Nominal (Rp)"}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field
                      label={
                        discountType === "percentage"
                          ? "Persentase Diskon"
                          : "Nominal Diskon"
                      }
                      required
                    >
                      <div className="relative">
                        {discountType === "nominal" && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                            Rp
                          </span>
                        )}
                        <input
                          type="number"
                          placeholder="0"
                          value={discountValue === 0 ? "" : discountValue}
                          onChange={(e) =>
                            setDiscountValue(Number(e.target.value))
                          }
                          className={`${inputCls} ${discountType === "nominal" ? "pl-9" : ""} ${discountType === "percentage" ? "pr-8" : ""}`}
                        />
                        {discountType === "percentage" && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                            %
                          </span>
                        )}
                      </div>
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 px-5 py-4 flex justify-end gap-3 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
            >
              {initialData ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

/* ── Helper components ── */

const inputCls =
  "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
        ${enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
          ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}
