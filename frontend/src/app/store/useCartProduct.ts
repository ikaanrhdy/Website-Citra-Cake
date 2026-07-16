import { create } from "zustand";
import type { productCart } from "@/types/data";
import type { CakeCustomizationFields } from "@/types/cake";
import { calculatePriceBySize } from "@/utils/data";

export type CartItem = productCart & {
  qty: number;
  selectedSize: string;
  finalPrice: number;
  // ↓ field tambahan khusus custom cake, opsional biar item cart biasa gak kena efek
  isCustom?: boolean;
  customFields?: CakeCustomizationFields;
};

export type CheckoutData = {
  items: CartItem[];
  subtotal: number;
};

type CartState = {
  items: CartItem[];
  totalQty: number;
  totalPrice: number;

  addToCart: (product: productCart, selectedSize: string) => void;
  removeFromCart: (id: string, selectedItems: string) => void;
  increaseQty: (id: string, selectedItems: string) => void;
  decreaseQty: (id: string, selectedItems: string) => void;
  clearCart: () => void;

  // ==== Custom Cake ====
  addCustomCakeToCart: (payload: {
    title?: string;
    image?: string;
    price: number; // total harga dari calculatePriceBreakdown().total
    summary: string; // ringkasan siap tampil, mis. "2 Layer • Brownies Kukus • Buttercream • Merah"
    customFields: CakeCustomizationFields;
  }) => void;

  // Checkout
  checkout: (selectedItems: CartItem[]) => void;
  getCheckout: () => CheckoutData | null;
  clearCheckout: () => void;
};

const SESSION_KEY = "checkout-items";

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalQty: 0,
  totalPrice: 0,

  addToCart: (product: productCart, selectedSize: string) => {
    const items = get().items;

    const finalPrice = calculatePriceBySize(
      product.price,
      product.size,
      selectedSize,
    );

    const exist = items.find(
      (i) => i.id === product.id && i.selectedSize === selectedSize,
    );

    let newItems: CartItem[];

    if (exist) {
      newItems = items.map((i) =>
        i.id === product.id && i.selectedSize === selectedSize
          ? { ...i, qty: i.qty + 1 }
          : i,
      );
    } else {
      newItems = [
        ...items,
        {
          ...product,
          size: [selectedSize],
          qty: 1,
          selectedSize,
          finalPrice,
        },
      ];
    }

    set({
      items: newItems,
      totalQty: newItems.reduce((a, b) => a + b.qty, 0),
      totalPrice: newItems.reduce((a, b) => a + b.qty * b.finalPrice, 0),
    });
  },

  removeFromCart: (id: string, selectedSize: string) => {
    const newItems = get().items.filter(
      (i) => !(i.id === id && i.selectedSize === selectedSize),
    );

    set({
      items: newItems,
      totalQty: newItems.reduce((a, b) => a + b.qty, 0),
      totalPrice: newItems.reduce((a, b) => a + b.qty * b.finalPrice, 0),
    });
  },

  increaseQty: (id: string, selectedSize: string) => {
    const newItems = get().items.map((i) =>
      i.id === id && i.selectedSize === selectedSize
        ? { ...i, qty: i.qty + 1 }
        : i,
    );
    set({
      items: newItems,
      totalQty: newItems.reduce((a, b) => a + b.qty, 0),
      totalPrice: newItems.reduce((a, b) => a + b.qty * b.finalPrice, 0),
    });
  },

  decreaseQty: (id: string, selectedSize: string) => {
    const newItems = get()
      .items.map((i) =>
        i.id === id && i.selectedSize === selectedSize
          ? { ...i, qty: i.qty - 1 }
          : i,
      )
      .filter((i) => i.qty > 0);
    set({
      items: newItems,
      totalQty: newItems.reduce((a, b) => a + b.qty, 0),
      totalPrice: newItems.reduce((a, b) => a + b.qty * b.finalPrice, 0),
    });
  },

  clearCart: () => set({ items: [], totalQty: 0, totalPrice: 0 }),

  // ================= CUSTOM CAKE =================
  // Custom cake selalu qty = 1 per submit. Kalau user custom lagi dengan
  // konfigurasi beda, itu jadi item baru dengan id unik sendiri (bukan digabung).
  addCustomCakeToCart: ({ title, image, price, summary, customFields }) => {
    const items = get().items;

    const newItem: CartItem = {
      id: `custom-${Date.now()}`,
      title: title ?? "Custom Cake",
      description: summary,
      image: image ?? "/images/custom-cake-placeholder.png",
      price,
      category: "custom-cake",
      size: [summary],
      rating: 0,
      reviews: 0,
      qty: 1,
      selectedSize: summary,
      finalPrice: price,
      isCustom: true,
      customFields,
    };

    const newItems = [...items, newItem];

    set({
      items: newItems,
      totalQty: newItems.reduce((a, b) => a + b.qty, 0),
      totalPrice: newItems.reduce((a, b) => a + b.qty * b.finalPrice, 0),
    });
  },

  // ================= CHECKOUT =================
  checkout: (selectedItems) => {
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.finalPrice * item.qty,
      0,
    );
    const payload: CheckoutData = { items: selectedItems, subtotal };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  },

  getCheckout: () => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  clearCheckout: () => {
    sessionStorage.removeItem(SESSION_KEY);
  },
}));
