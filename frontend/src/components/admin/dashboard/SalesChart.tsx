import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SalesPoint } from "@/types/dashboard";

const formatY = (value: number) => {
  if (value >= 1000) return `${value / 1000}k`;
  return `${value}`;
};

const SalesChart = ({ data }: { data: SalesPoint[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-lg p-4 sm:p-5"
    >
      <h3 className="font-semibold text-sm sm:text-base mb-4">
        Grafik Penjualan 30 Hari Terakhir
      </h3>

      <div className="w-full h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tickFormatter={formatY}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number | undefined) => [
                `Rp ${(value ?? 0).toLocaleString("id-ID")}`,
                "Omset",
              ]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7e22ce"
              strokeWidth={2}
              dot={{ r: 3, fill: "#7e22ce" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChart;
