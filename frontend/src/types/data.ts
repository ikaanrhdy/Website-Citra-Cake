export interface products {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number; // harga sebelum diskon, optional
  discountLabel?: string;
  discount?: number;
  category: string;
  size: string[];
  rating: number;
  reviews: number;
  status?: "Ready Stock" | "Pre-Order" | "Habis";
  createdAt: string; // contoh: "2026-06-20"
}

export interface productCart {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  size: string[];
  rating: number;
  reviews: number;
}

export interface Profile {
  name: string;
  email: string;
  birthdate: string;
  gender: string;
  phone: string;
  avatar: string;

  updateField: (
    field: keyof Omit<Profile, "updateField" | "reset">,
    value: string,
  ) => void;
  reset: () => void;
}

// admin
export interface ProductSize {
  label: string;
  price: number;
}

export interface productsAdmin {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  discountFlat?: number;
  isPreOrder?: boolean;
  category: string;
  size: ProductSize[];
  variant: string[];
  stock: number;
  note: string;
  rating: number;
  reviews: number;
}

export interface BaseCake {
  name: string;
  price: string;
  status: boolean;
}

export interface TipeCream {
  name: string;
  price: string;
  status: boolean;
}

export interface WarnaCream {
  warna: string;
  name: string;
  PriceAdding: string;
  status: boolean;
}

export interface Layer {
  layer: string;
  price: string;
  status: boolean;
}

export interface SizeCustomize {
  size: string;
  price: string;
  status: boolean;
}

export interface Topping {
  name: string;
  price: string;
  status: boolean;
}
export interface Lilin {
  name: string;
  price: string;
  status: boolean;
}
