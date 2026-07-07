import { motion } from "framer-motion";
import type { BadgeData } from "@/types/dashboard";

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08 },
  }),
};

const StatusBadgeGrid = ({ badges }: { badges: BadgeData[] }) => {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
      {badges.map((item, i) => (
        <motion.div
          key={item.name}
          variants={cardVariant}
          initial="hidden"
          animate="show"
          custom={i}
          className={`${item.bgClass} ${item.borderClass} border rounded-md p-3 sm:p-4`}
        >
          <p
            className={`${item.textClass} text-xs sm:text-sm font-medium mb-1 truncate uppercase`}
          >
            {item.name}
          </p>
          <p
            className={`${item.textClass} text-lg sm:text-xl font-bold leading-none`}
          >
            {item.count}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatusBadgeGrid;
