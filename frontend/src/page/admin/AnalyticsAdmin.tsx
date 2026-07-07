import type { productsAdmin } from "@/types/data";
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// ===== Dummy Data =====
const dummyProducts: productsAdmin[] = [
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
    rating: 4.5,
    reviews: 10,
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
    rating: 4.2,
    reviews: 8,
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
    rating: 4.8,
    reviews: 15,
  },
];

const dummyTransactions = [
  { id: "t1", productId: "1", qty: 5, total: 250000, date: "2025-12-01" },
  { id: "t2", productId: "2", qty: 3, total: 180000, date: "2025-12-02" },
  { id: "t3", productId: "3", qty: 2, total: 140000, date: "2025-12-03" },
  { id: "t4", productId: "1", qty: 10, total: 500000, date: "2025-12-04" },
];

// Pie chart colors
const COLORS = ["#4f46e5", "#f97316", "#10b981"];

interface PieDataItem {
  [key: string]: string | number;
}

interface SalesPerProductItem {
  name: string;
  sold: number;
}

const AnalyticsAdmin = () => {
  // ================= SUMMARY =================
  const totalRevenue = dummyTransactions.reduce((acc, t) => acc + t.total, 0);
  const totalItemsSold = dummyTransactions.reduce((acc, t) => acc + t.qty, 0);
  const totalProducts = dummyProducts.length;
  const avgRating =
    dummyProducts.reduce((acc, p) => acc + p.rating, 0) / totalProducts;

  // ================= CHART DATA =================
  const revenuePerDay = dummyTransactions.map((t) => ({
    date: t.date,
    revenue: t.total,
  }));

  const salesPerProduct: SalesPerProductItem[] = dummyProducts.map((p) => {
    const sold = dummyTransactions
      .filter((t) => t.productId === p.id)
      .reduce((acc, t) => acc + t.qty, 0);
    return { name: p.title, sold };
  });

  const categoryDistribution: Record<string, number> = dummyProducts.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData: PieDataItem[] = Object.entries(categoryDistribution).map(
    ([name, value]) => ({ name, value })
  );

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
          <span className="text-sm text-muted-foreground">Total Produk</span>
          <span className="text-lg font-semibold">{totalProducts}</span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col">
          <span className="text-sm text-muted-foreground">
            Rating Rata-rata
          </span>
          <span className="text-lg font-semibold">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Line Chart Pendapatan */}
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

        {/* Bar Chart Penjualan Produk */}
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

        {/* Pie Chart Kategori */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
          <span className="text-sm font-medium mb-2 block">
            Distribusi Produk per Kategori
          </span>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((item, i) => (
                  <Cell
                    key={`cell-${item.name}`}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TABEL DETAIL PRODUK ================= */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left">Produk</th>
              <th className="p-2 text-left">Stok</th>
              <th className="p-2 text-left">Harga</th>
              <th className="p-2 text-left">Rating</th>
              <th className="p-2 text-left">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {dummyProducts.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">Rp {p.price.toLocaleString("id-ID")}</td>
                <td className="p-2">{p.rating}</td>
                <td className="p-2">{p.reviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AnalyticsAdmin;
