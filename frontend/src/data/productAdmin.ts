import type { productsAdmin } from "@/types/data";

export const product: productsAdmin[] = [
  {
    id: "1",
    title: "Black Forest Cake",
    description: "Kue cokelat lembut dengan krim dan buah cherry",
    image: "/product/1.avif",
    price: 153000,
    originalPrice: 180000,
    discount: 15,
    category: "Cake",
    size: [
      { label: "Small (20cm)", price: 180000 },
      { label: "Medium (25cm)", price: 250000 },
      { label: "Large (30cm)", price: 350000 },
    ],
    variant: ["Original", "Extra Chocolate", "Less Sugar"],
    stock: 15,
    note: "Best seller",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: "2",
    title: "Red Velvet Cake",
    description: "Kue red velvet dengan cream cheese frosting",
    image: "/product/2.avif",
    price: 150000,
    originalPrice: 200000,
    discountFlat: 50000,
    isPreOrder: true,
    category: "Cake",
    size: [
      { label: "Small (20cm)", price: 200000 },
      { label: "Medium (25cm)", price: 280000 },
    ],
    variant: ["Classic", "Blueberry", "Strawberry"],
    stock: 0,
    note: "Pre-order 3 hari sebelumnya",
    rating: 4.7,
    reviews: 85,
  },
  {
    id: "3",
    title: "Brownies",
    description: "Brownies lembut dan legit dengan topping coklat",
    image: "/product/7.avif",
    price: 95000,
    category: "Cake",
    size: [
      { label: "16 cm", price: 95000 },
      { label: "20 cm", price: 130000 },
      { label: "24 cm", price: 175000 },
    ],
    variant: ["Coklat", "Keju", "Kacang"],
    stock: 60,
    note: "Cocok untuk hadiah",
    rating: 5.0,
    reviews: 90,
  },
];

export const baseCake = []
