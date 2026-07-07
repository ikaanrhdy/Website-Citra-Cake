import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useKustomisasiStore,
  type KustomisasiTab,
  type KustomisasiItem,
} from "@/app/store/admin/useKustomisasiStore";

import BaseCake from "./kustomisasi/BaseCake";
import TipeCake from "./kustomisasi/TipeCake";
import WarnaCream from "./kustomisasi/WarnaCream";
import Layer from "./kustomisasi/Layer";
import Ukuran from "./kustomisasi/Ukuran";
import Topping from "./kustomisasi/Topping";
import Lilin from "./kustomisasi/Lilin";
import Topper from "./kustomisasi/Topper";
import type { AdminLayoutContext } from "@/layout/AdminLayout";
import AdminPageHeader from "@/components/admin/PageHeaders";
import { KustomisasiModal } from "./kustomisasi/KustomisasiModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const TABS: KustomisasiTab[] = [
  "Base Cake",
  "Tipe Cream",
  "Warna Cream",
  "Layer",
  "Ukuran",
  "Topping",
  "Lilin",
  "Topper",
];

interface TabComponentProps {
  onEdit: (item: KustomisasiItem) => void;
  onDelete: (id: string) => void;
}

const TAB_COMPONENTS: Record<
  KustomisasiTab,
  React.ComponentType<TabComponentProps>
> = {
  "Base Cake": BaseCake,
  "Tipe Cream": TipeCake,
  "Warna Cream": WarnaCream,
  Layer: Layer,
  Ukuran: Ukuran,
  Topping: Topping,
  Lilin: Lilin,
  Topper: Topper,
};

const KustomisasiAdmin = () => {
  const { onOpenSidebar } = useOutletContext<AdminLayoutContext>();
  const { activeTab, setActiveTab, items, addItem, updateItem, deleteItem } =
    useKustomisasiStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<KustomisasiItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KustomisasiItem | null>(
    null,
  );

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (item: KustomisasiItem) => {
    setEditTarget(item);
    setModalOpen(true);
  };

  const requestDelete = (id: string) => {
    const target = items[activeTab].find((item) => item.id === id) ?? null;
    setDeleteTarget(target);
  };

  const handleSave = (item: KustomisasiItem) => {
    if (editTarget) {
      updateItem(activeTab, item);
    } else {
      addItem(activeTab, item);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteItem(activeTab, deleteTarget.id);
    toast.error(`"${deleteTarget.nama}" berhasil dihapus`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <AdminPageHeader
        title="Kelola Bahan Kustomisasi"
        subtitle="Atur pilihan topping, rasa, dan opsi kustomisasi lainnya"
        onOpenSidebar={onOpenSidebar}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        }
      />

      {/* ── Card Wrapper ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* ── Tab Bar ── */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm whitespace-nowrap transition cursor-pointer shrink-0
                  ${
                    activeTab === tab
                      ? "text-white font-semibold"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-active"
                    className="absolute inset-x-2 inset-y-1.5 rounded-lg bg-primary z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Content (per-tab page component) ── */}
        <div className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent onEdit={openEdit} onDelete={requestDelete} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Modal & Confirm Dialog (single instance for all tabs) ── */}
      <AnimatePresence>
        {modalOpen && (
          <KustomisasiModal
            tab={activeTab}
            initialData={editTarget}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            title="Hapus item ini?"
            description={`"${deleteTarget.nama}" akan dihapus secara permanen dan tidak bisa dikembalikan.`}
            confirmLabel="Hapus"
            cancelLabel="Batal"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KustomisasiAdmin;
