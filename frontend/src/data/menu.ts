import {
  Home,
  Package,
  Sparkles,
  LogOut,
  House,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react";
import type { AdminRole } from "./adminData";

export interface MenuAdmin {
  name: string;
  path: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconUrl?: string;
  roles: AdminRole[];
}

export interface MenuUser {
  name: string;
  path: string;
  icon: LucideIcon;
}

export const menuAdmin: MenuAdmin[] = [
  {
    name: "Home",
    path: "/admin",
    icon: Home,
    roles: ["owner", "admin"],
  },
  {
    name: "Produk",
    path: "/admin/product",
    icon: Package,
    roles: ["admin"],
  },
  {
    name: "Bahan Kustomisasi",
    path: "/admin/kustomisasi",
    icon: Sparkles,
    roles: ["admin"],
  },
];

export const logoutMenu = {
  name: "Logout",
  icon: LogOut,
};

export const menuUser: MenuUser[] = [
  {
    name: "Home",
    path: "/home",
    icon: House,
  },
  {
    name: "Riwayat Belanja",
    path: "/order",
    icon: ShoppingBag,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];
