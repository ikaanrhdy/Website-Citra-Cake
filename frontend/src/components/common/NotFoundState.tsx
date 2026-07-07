import { motion } from "framer-motion";
import { PackageSearch, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
};

const NotFoundState = ({
  icon: Icon = PackageSearch,
  title,
  description,
  actionLabel,
  onAction,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 bg-white border border-gray-200 rounded-lg py-16 px-6 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
        <Icon className="w-7 h-7 text-primary" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 max-w-xs">{description}</p>
        )}
      </div>

      <Button
        onClick={onAction}
        className="bg-primary text-white cursor-pointer px-6"
      >
        {actionLabel}
      </Button>
    </motion.div>
  );
};

export default NotFoundState;
