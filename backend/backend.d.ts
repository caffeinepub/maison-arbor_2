import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Product {
  id: bigint;
  name: string;
  category: string;
  material: string;
  price: bigint; // in paise (INR * 100)
  description: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
}

export interface CartItem {
  productId: bigint;
  quantity: bigint;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: bigint;
  customerId: Principal;
  customerInfo: CustomerInfo;
  items: CartItem[];
  total: bigint;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: bigint;
}

export interface CustomRequest {
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
}

export interface ContactSubmission {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: bigint;
}

export type Result<T, E> = { ok: T } | { err: E };

export interface _SERVICE {
  // Products
  getProducts: ActorMethod<[], Product[]>;
  getProductsByCategory: ActorMethod<[string], Product[]>;
  getProductById: ActorMethod<[bigint], [] | [Product]>;
  getFeaturedProducts: ActorMethod<[], Product[]>;
  addProduct: ActorMethod<[{ name: string; category: string; material: string; price: bigint; description: string; imageUrl: string; inStock: boolean; featured: boolean }], Result<bigint, string>>;
  
  // Cart
  addToCart: ActorMethod<[bigint, bigint], Result<null, string>>;
  removeFromCart: ActorMethod<[bigint], undefined>;
  updateCartQuantity: ActorMethod<[bigint, bigint], undefined>;
  getCart: ActorMethod<[], CartItem[]>;
  clearCart: ActorMethod<[], undefined>;
  
  // Orders
  createOrder: ActorMethod<[CustomerInfo, CartItem[], bigint, string], Result<bigint, string>>;
  confirmPayment: ActorMethod<[bigint, string], Result<null, string>>;
  getOrder: ActorMethod<[bigint], Result<Order, string>>;
  getAllOrders: ActorMethod<[], Result<Order[], string>>;
  updateOrderStatus: ActorMethod<[bigint, string], Result<null, string>>;
  
  // Razorpay
  setRazorpayKeys: ActorMethod<[string, string], Result<null, string>>;
  getRazorpayKeyId: ActorMethod<[], string>;
  createRazorpayOrder: ActorMethod<[bigint, string], Result<string, string>>;
  
  // Custom Creations
  submitCustomRequest: ActorMethod<[{ customerName: string; email: string; phone: string; description: string; preferredCategory: string; budgetRange: string; fileId: string }], Result<bigint, string>>;
  getCustomRequests: ActorMethod<[], Result<CustomRequest[], string>>;
  updateCustomRequestStatus: ActorMethod<[bigint, string], Result<null, string>>;
  
  // Contact
  submitContact: ActorMethod<[string, string, string, string], Result<bigint, string>>;
  getContacts: ActorMethod<[], Result<ContactSubmission[], string>>;
  
  // Categories
  getCategories: ActorMethod<[], string[]>;
  
  // Admin
  isAdmin: ActorMethod<[], boolean>;
}
