import { motion } from "framer-motion";
import { statusConfig, STATUS_LIST } from "@/data/orderAdminDummy";
import useOrderAdminStore from "@/app/store/admin/useOrderAdminStore";

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const OrderStatusFilterGrid = () => {
  const { activeStatus, setActiveStatus, getStatusCount } =
    useOrderAdminStore();

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {STATUS_LIST.map((status, i) => {
        const st = statusConfig[status];
        const isActive = activeStatus === status;
        const count = getStatusCount(status);

        return (
          <motion.button
            key={status}
            variants={cardVariant}
            initial="hidden"
            animate="show"
            custom={i}
            onClick={() => setActiveStatus(isActive ? null : status)}
            className={`text-left border rounded-lg p-3 sm:p-4 transition cursor-pointer
              ${st.bgClass} ${st.borderClass}
              ${isActive ? "ring-2 ring-offset-1 ring-primary" : "hover:opacity-80"}
            `}
          >
            <p
              className={`${st.textClass} text-xs sm:text-sm font-medium mb-1`}
            >
              {status}
            </p>
            <p
              className={`${st.textClass} text-lg sm:text-xl font-bold leading-none`}
            >
              {count}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
};

export default OrderStatusFilterGrid;
