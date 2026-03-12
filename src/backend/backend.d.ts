import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Product {
  id: bigint;
  name: string;
  category: string;
  material: string;
  price: bigint;
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

export type OkErr<T> = { ok: T } | { err: string };
export type OkVoidErr = { ok: null } | { err: string };

export interface _SERVICE {
  // Products
  getProducts: ActorMethod<[], Product[]>;
  getProductsByCategory: ActorMethod<[string], Product[]>;
  getProductById: ActorMethod<[bigint], [] | [Product]>;
  getFeaturedProducts: ActorMethod<[], Product[]>;
  getCategories: ActorMethod<[], string[]>;

  // Cart
  addToCart: ActorMethod<[bigint, bigint], OkVoidErr>;
  removeFromCart: ActorMethod<[bigint], undefined>;
  updateCartQuantity: ActorMethod<[bigint, bigint], undefined>;
  getCart: ActorMethod<[], CartItem[]>;
  clearCart: ActorMethod<[], undefined>;

  // Orders
  createOrder: ActorMethod<[CustomerInfo, CartItem[], bigint, string], OkErr<bigint>>;
  confirmPayment: ActorMethod<[bigint, string], OkVoidErr>;
  getOrder: ActorMethod<[bigint], OkErr<Order>>;
  getAllOrders: ActorMethod<[], OkErr<Order[]>>;
  updateOrderStatus: ActorMethod<[bigint, string], OkVoidErr>;

  // Razorpay
  setRazorpayKeys: ActorMethod<[string, string], OkVoidErr>;
  getRazorpayKeyId: ActorMethod<[], string>;
  createRazorpayOrder: ActorMethod<[bigint, string], OkErr<string>>;

  // Custom Creations
  submitCustomRequest: ActorMethod<[string, string, string, string, string, string, string], OkErr<bigint>>;
  getCustomRequests: ActorMethod<[], OkErr<CustomRequest[]>>;
  updateCustomRequestStatus: ActorMethod<[bigint, string], OkVoidErr>;

  // Contact
  submitContact: ActorMethod<[string, string, string, string], OkErr<bigint>>;
  getContacts: ActorMethod<[], OkErr<ContactSubmission[]>>;

  // Admin
  isAdmin: ActorMethod<[], boolean>;

  // From MixinAuthorization
  _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
  getCallerUserRole: ActorMethod<[], { admin: null } | { user: null } | { guest: null }>;
  isCallerAdmin: ActorMethod<[], boolean>;
}
