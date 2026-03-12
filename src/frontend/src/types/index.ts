export type Product = {
  id: bigint;
  name: string;
  category: string;
  material: string;
  price: bigint;
  description: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
};

export type CartItem = {
  productId: bigint;
  quantity: bigint;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export type Order = {
  id: bigint;
  customerId: unknown;
  customerInfo: CustomerInfo;
  items: CartItem[];
  total: bigint;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: bigint;
};

export type CustomRequest = {
  id: bigint;
  customerName: string;
  email: string;
  phone: string;
  description: string;
  preferredCategory: string;
  budgetRange: string;
  fileId: string;
  status: string;
  submittedAt: bigint;
};

export type ContactSubmission = {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: bigint;
};

export type LocalCartItem = {
  product: Product;
  quantity: number;
};

export function formatPrice(paise: bigint | number): string {
  const inr = Number(paise) / 100;
  return inr.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export const CATEGORIES = [
  {
    name: "Centre Tables",
    slug: "centre-tables",
    image: "/assets/generated/cat-centre-tables.dim_800x1000.jpg",
  },
  {
    name: "Coffee Tables",
    slug: "coffee-tables",
    image: "/assets/generated/cat-coffee-tables.dim_800x1000.jpg",
  },
  {
    name: "Teapoys",
    slug: "teapoys",
    image: "/assets/generated/cat-teapoys.dim_800x1000.jpg",
  },
  {
    name: "Sofa Siders",
    slug: "sofa-siders",
    image: "/assets/generated/cat-sofa-siders.dim_800x1000.jpg",
  },
  {
    name: "TV Unit Bottoms",
    slug: "tv-unit-bottoms",
    image: "/assets/generated/cat-tv-units.dim_800x1000.jpg",
  },
  {
    name: "Bar Tables",
    slug: "bar-tables",
    image: "/assets/generated/cat-bar-tables.dim_800x1000.jpg",
  },
  {
    name: "Garden Sets",
    slug: "garden-sets",
    image: "/assets/generated/cat-garden-sets.dim_800x1000.jpg",
  },
  {
    name: "Designer Shoe Racks",
    slug: "designer-shoe-racks",
    image: "/assets/generated/cat-shoe-racks.dim_800x1000.jpg",
  },
];

export function categoryNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function slugToCategoryName(slug: string): string {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return cat ? cat.name : slug;
}
