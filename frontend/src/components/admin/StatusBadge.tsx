import type { KustomisasiStatus } from "@/app/store/admin/useKustomisasiStore";

export const StatusBadge = ({ status }: { status: KustomisasiStatus }) => (
  <span
    className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold
      ${
        status === "Tersedia"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      }`}
  >
    {status}
  </span>
);
