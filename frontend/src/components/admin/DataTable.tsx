import { Pencil, Trash2 } from "lucide-react";
import type { KustomisasiItem } from "@/app/store/admin/useKustomisasiStore";
import { StatusBadge } from "./StatusBadge";

interface DataTableProps {
  data: KustomisasiItem[];
  emptyLabel: string;
  showWarna?: boolean;
  onEdit: (item: KustomisasiItem) => void;
  onDelete: (id: string) => void;
}

export const DataTable = ({
  data,
  emptyLabel,
  showWarna,
  onEdit,
  onDelete,
}: DataTableProps) => {
  if (data.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        Belum ada data {emptyLabel}. Klik "+ Tambah" untuk menambahkan.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">
            {showWarna && (
              <th className="text-left py-3 px-4 font-medium">Warna</th>
            )}
            <th className="text-left py-3 px-4 font-medium">Nama</th>
            <th className="text-left py-3 px-4 font-medium">
              {showWarna ? "Harga Tambahan" : "Harga"}
            </th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-right py-3 px-4 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            >
              {showWarna && (
                <td className="py-3.5 px-4">
                  <span
                    className="inline-block w-5 h-5 rounded-full border border-gray-200 ring-2 ring-white"
                    style={{
                      backgroundColor: item.warna ?? "#fff",
                      boxShadow: `0 2px 8px 0 ${item.warna ?? "#fff"}66`,
                    }}
                  />
                </td>
              )}
              <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-gray-200">
                {item.nama}
                {showWarna && (
                  <p className="text-xs text-gray-400 uppercase font-normal">
                    {item.warna}
                  </p>
                )}
              </td>
              <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                {item.harga == null
                  ? "Gratis"
                  : `Rp ${item.harga.toLocaleString("id-ID")}`}
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-400 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-400 hover:text-blue-600 transition cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
