// Auto-generated backend bindings stub
// This file is overwritten during deployment

import { HttpAgent } from "@icp-sdk/core/agent";

export type CreateActorOptions = {
  agentOptions?: { identity?: any };
  agent?: HttpAgent;
  processError?: (e: unknown) => never;
};

export class ExternalBlob {
  onProgress?: (pct: number) => void;

  static fromURL(url: string): ExternalBlob {
    const b = new ExternalBlob();
    (b as any)._url = url;
    return b;
  }

  async getBytes(): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async toURL(): Promise<string> {
    return (this as any)._url || "";
  }
}

// Inline variant result types (no Result import)
export type OkErr<T> = { ok: T } | { err: string };
export type OkVoidErr = { ok: null } | { err: string };

export type backendInterface = {
  _initializeAccessControlWithSecret(secret: string): Promise<void>;
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: bigint): Promise<[Product] | []>;
  getFeaturedProducts(): Promise<Product[]>;
  addToCart(productId: bigint, quantity: bigint): Promise<OkVoidErr>;
  removeFromCart(productId: bigint): Promise<OkVoidErr>;
  updateCartQuantity(productId: bigint, quantity: bigint): Promise<OkVoidErr>;
  getCart(): Promise<CartItem[]>;
  clearCart(): Promise<OkVoidErr>;
  createOrder(
    customerInfo: CustomerInfo,
    items: CartItem[],
    total: bigint,
    razorpayOrderId: string
  ): Promise<OkErr<bigint>>;
  confirmPayment(orderId: bigint, razorpayPaymentId: string): Promise<OkVoidErr>;
  getOrder(orderId: bigint): Promise<OkErr<Order>>;
  getAllOrders(): Promise<OkErr<Order[]>>;
  updateOrderStatus(orderId: bigint, status: string): Promise<OkVoidErr>;
  // 7 individual string arguments
  submitCustomRequest(
    customerName: string,
    email: string,
    phone: string,
    description: string,
    preferredCategory: string,
    budgetRange: string,
    fileId: string
  ): Promise<OkErr<bigint>>;
  getCustomRequests(): Promise<OkErr<CustomRequest[]>>;
  updateCustomRequestStatus(id: bigint, status: string): Promise<OkVoidErr>;
  submitContact(name: string, email: string, phone: string, message: string): Promise<OkErr<bigint>>;
  getContacts(): Promise<OkErr<ContactSubmission[]>>;
  isAdmin(): Promise<boolean>;
  getRazorpayKeyId(): Promise<string>;
  createRazorpayOrder(amountInPaise: bigint, receiptId: string): Promise<OkErr<string>>;
  setRazorpayKeys(keyId: string, keySecret: string): Promise<OkVoidErr>;
  addProduct(product: {
    name: string;
    category: string;
    material: string;
    price: bigint;
    description: string;
    imageUrl: string;
    inStock: boolean;
    featured: boolean;
  }): Promise<OkErr<bigint>>;
  getCategories(): Promise<string[]>;
  _caffeineStorageCreateCertificate(hash: string): Promise<void>;
};

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
  customerId: any;
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

export async function createActor(
  _canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  _options?: CreateActorOptions
): Promise<backendInterface> {
  throw new Error("Backend not initialized — canister bindings not generated");
}
