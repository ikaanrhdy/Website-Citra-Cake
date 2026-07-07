import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useOutletContext } from "react-router";
import type { productsAdmin } from "@/types/data";
import { useProductStore } from "@/app/store/admin/productStoreAdmin";
import { ProductModal } from "@/components/admin/ProductModal";
import ProductCard from "@/components/admin/ProductCard";
import type { AdminLayoutContext } from "@/layout/AdminLayout";
import AdminPageHeader from "@/components/admin/PageHeaders";

const ProductAdmin = () => {
  const { onOpenSidebar } = useOutletContext<AdminLayoutContext>();

  const products = useProductStore((state) => state.products);
  const search = useProductStore((state) => state.search);
  const setSearch = useProductStore((state) => state.setSearch);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<productsAdmin | null>(null);

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (item: productsAdmin) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSave = (
    data: Omit<productsAdmin, "id" | "rating" | "reviews">,
  ) => {
    if (editing) {
      updateProduct(editing.id, data);
    } else {
      addProduct({
        id: Date.now().toString(),
        ...data,
        rating: 0,
        reviews: 0,
      });
    }
    setModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* ================= HEADER ================= */}
      <AdminPageHeader
        title="Produk"
        subtitle="Kelola produk Citra Cake"
        onOpenSidebar={onOpenSidebar}
        action={
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Produk</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        }
      />

      {/* ================= SEARCH ================= */}
      <div className="relative w-full md:max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama kue..."
          className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
        />
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map((item, i) => (
          <ProductCard
            key={item.id}
            item={item}
            index={i}
            onEdit={handleEdit}
            onDelete={deleteProduct}
          />
        ))}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {modalOpen && (
          <ProductModal
            initialData={editing}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductAdmin;
