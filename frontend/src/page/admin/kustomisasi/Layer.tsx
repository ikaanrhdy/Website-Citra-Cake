import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  useKustomisasiStore,
  type KustomisasiItem,
} from "@/app/store/admin/useKustomisasiStore";
import { DataTable } from "@/components/admin/DataTable";
import { KustomisasiModal } from "./KustomisasiModal";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const TAB = "Layer" as const;

const Layer = () => {
  const { items, addItem, updateItem, deleteItem } = useKustomisasiStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<KustomisasiItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KustomisasiItem | null>(
    null,
  );

  const data = items[TAB];

  const openEdit = (item: KustomisasiItem) => {
    setEditTarget(item);
    setModalOpen(true);
  };

  const handleSave = (item: KustomisasiItem) => {
    if (editTarget) {
      updateItem(TAB, item);
    } else {
      addItem(TAB, item);
    }
  };

  const requestDelete = (id: string) => {
    const target = data.find((item) => item.id === id) ?? null;
    setDeleteTarget(target);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteItem(TAB, deleteTarget.id);
    toast.error(`"${deleteTarget.nama}" berhasil dihapus`);
    setDeleteTarget(null);
  };
  return (
    <div>
      <div className="p-4">
        <DataTable
          data={data}
          emptyLabel={TAB}
          onEdit={openEdit}
          onDelete={requestDelete}
        />
      </div>

      <AnimatePresence>
        {modalOpen && (
          <KustomisasiModal
            tab={TAB}
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

export default Layer;
