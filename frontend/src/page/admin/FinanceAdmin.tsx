import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

// ======= Dummy Data =======
const dummyProducts = [
  {
    id: "1",
    title: "Kue Coklat",
    description: "",
    image: "/kue1.jpg",
    price: 50000,
    category: "Kue",
    size: ["S", "M"],
    variant: ["Coklat"],
    stock: 50,
    note: "",
    rating: 0,
    reviews: 0,
  },
  {
    id: "2",
    title: "Kue Keju",
    description: "",
    image: "/kue2.jpg",
    price: 60000,
    category: "Kue",
    size: ["S", "M"],
    variant: ["Keju"],
    stock: 30,
    note: "",
    rating: 0,
    reviews: 0,
  },
  {
    id: "3",
    title: "Kue Strawberry",
    description: "",
    image: "/kue3.jpg",
    price: 70000,
    category: "Kue",
    size: ["S", "M"],
    variant: ["Strawberry"],
    stock: 20,
    note: "",
    rating: 0,
    reviews: 0,
  },
];

const dummyTransactions = [
  { id: "t1", productId: "1", qty: 5, total: 250000, date: "2025-12-01" },
  { id: "t2", productId: "2", qty: 3, total: 180000, date: "2025-12-02" },
  { id: "t3", productId: "3", qty: 2, total: 140000, date: "2025-12-03" },
  { id: "t4", productId: "1", qty: 10, total: 500000, date: "2025-12-04" },
];

// ======= Finance Admin Component =======
const FinanceAdmin = () => {
  // ================= SUMMARY =================
  const totalRevenue = dummyTransactions.reduce((acc, t) => acc + t.total, 0);
  const totalItemsSold = dummyTransactions.reduce((acc, t) => acc + t.qty, 0);

  // Prepare data for charts
  const revenuePerDay = dummyTransactions.map((t) => ({
    date: t.date,
    revenue: t.total,
  }));

  const salesPerProduct = dummyProducts.map((p) => {
    const sold = dummyTransactions
      .filter((t) => t.productId === p.id)
      .reduce((acc, t) => acc + t.qty, 0);
    return { name: p.title, sold };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 md:p-6"
    >
      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col">
          <span className="text-sm text-muted-foreground">
            Total Pendapatan
          </span>
          <span className="text-lg font-semibold">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col">
          <span className="text-sm text-muted-foreground">
            Total Produk Terjual
          </span>
          <span className="text-lg font-semibold">{totalItemsSold}</span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col">
          <span className="text-sm text-muted-foreground">
            Cash Flow Saat Ini
          </span>
          <span className="text-lg font-semibold">
            Rp {(totalRevenue * 0.8).toLocaleString("id-ID")}
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col">
          <span className="text-sm text-muted-foreground">Profit Estimate</span>
          <span className="text-lg font-semibold">
            Rp {(totalRevenue * 0.5).toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
          <span className="text-sm font-medium mb-2 block">
            Pendapatan Harian
          </span>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenuePerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
          <span className="text-sm font-medium mb-2 block">
            Penjualan per Produk
          </span>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesPerProduct}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TABEL TRANSAKSI ================= */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left">Produk</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {dummyTransactions.map((t) => {
              const product = dummyProducts.find((p) => p.id === t.productId);
              return (
                <tr
                  key={t.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-2">{product?.title}</td>
                  <td className="p-2">{t.qty}</td>
                  <td className="p-2">Rp {t.total.toLocaleString("id-ID")}</td>
                  <td className="p-2">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default FinanceAdmin;
