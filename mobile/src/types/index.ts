// Shared API types — mirror the Sed_Ecomm backend response contracts so the
// mobile app consumes the exact same endpoints as the web client.

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { field?: string; message: string }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parent?: string | { id: string; name: string; slug: string };
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface ProductVariants {
  sizes: string[];
  colors: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  description: string;
  category: Category | string;
  images: ProductImage[];
  price: number;
  discountPrice?: number;
  currency?: string;
  rating: number;
  numReviews: number;
  stock: number;
  variants?: ProductVariants;
  tags?: string[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brand?: string;
  size?: string;
  color?: string;
  inStock?: boolean;
  onSale?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  search?: string;
}

export interface SelectedVariant {
  size?: string;
  color?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: SelectedVariant;
  qty: number;
  savedForLater?: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  couponCode?: string;
  total: number;
  currency: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  id: string;
  product: string;
  name: string;
  image?: string;
  variant?: SelectedVariant;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  // Admin listing populates the customer + address; absent on a user's own orders.
  user?: { id?: string; name?: string; email?: string };
  shippingAddress?: Address;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: string;
  couponCode?: string;
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'card_credit' | 'card_debit' | 'upi' | 'netbanking' | 'wallet' | 'cod';
