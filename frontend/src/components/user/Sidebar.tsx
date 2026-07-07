import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { menuUser } from "@/data/menu";

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();

  return (
    <div className="h-full p-5 space-y-3 bg-background">
      {menuUser.map((item, i) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 p-3 font-medium rounded-lg transition-all${isActive
                  ? "bg-purple-300 text-purple-900 font-semibold shadow-md"
                  : "text-primary hover:bg-purple-200"
              }
  `}
            >
              {/* Icon with motion pulse on active */}
              <motion.div
                animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
              >
                <Icon size={20} />
              </motion.div>

              <span>{item.name}</span>

              {/* Active Glow Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-purple-700"
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Sidebar;
