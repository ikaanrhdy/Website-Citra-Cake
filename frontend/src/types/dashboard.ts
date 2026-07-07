import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface DashboardStat {
  title: string;
  value: string;
  icon: LucideIcon; // sesuaikan import type yg sudah ada
  color: string;
  bg: string;
  onClick?: () => void;
}

export interface BadgeData {
  name: string;
  count: number;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export interface OrderItem {
  name: string;
  qty: number;
}

export type StatusKey =
  | "Menunggu"
  | "Diproses"
  | "Dikirim"
  | "Sampai"
  | "Selesai"
  | "Dibatalkan"
  | "Dikembalikan";

export interface ActionButton {
  label: string;
  icon: IconType;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export interface Order {
  id: string;
  date: string;
  status: StatusKey;
  total: string;
  isCustom?: boolean;
  customer: {
    name: string;
    phone: string;
  };
  delivery: {
    date: string;
  };
  items?: OrderItem[];
  customDesc?: string;
  note: string;
  statusInfo?: string;
  actions: ActionButton[];
}

export interface SalesPoint {
  date: string;
  value: number;
}
