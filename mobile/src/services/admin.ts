import { api } from './api';
import type { ApiResponse, Order, OrderStatus, PaginatedResponse, Product, User } from '@/types';

// ---- Dashboard ----
export interface DashboardSummary {
  totalSales: number;
  dailySales: number;
  monthlySales: number;
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export async function getDashboardSummary() {
  const res = await api.get<ApiResponse<DashboardSummary>>('/admin/dashboard/summary');
  return res.data.data!;
}

export interface BestSeller {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images'>;
  unitsSold: number;
  revenue: number;
}
export async function getBestSellers() {
  const res = await api.get<ApiResponse<BestSeller[]>>('/admin/dashboard/best-sellers');
  return res.data.data ?? [];
}

// ---- Products (admin) ----
export async function getAdminProducts() {
  const res = await api.get<PaginatedResponse<Product>>('/products', { params: { limit: 50 } });
  return res.data.data ?? [];
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export async function createProduct(input: ProductInput) {
  const res = await api.post<ApiResponse<Product>>('/products', input);
  return res.data.data!;
}
export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const res = await api.patch<ApiResponse<Product>>(`/products/${id}`, input);
  return res.data.data!;
}
export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}

// ---- Orders (admin) ----
export async function getAdminOrders() {
  const res = await api.get<PaginatedResponse<Order>>('/admin/orders', { params: { limit: 50 } });
  return res.data.data ?? [];
}
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const res = await api.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status });
  return res.data.data!;
}

// ---- Coupons (admin) ----
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit?: number;
  isActive: boolean;
}
export async function getCoupons() {
  const res = await api.get<ApiResponse<Coupon[]>>('/coupons');
  return res.data.data ?? [];
}
export interface CouponInput {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  expiresAt: string;
  minOrderValue?: number;
  maxDiscount?: number;
  isActive?: boolean;
}
export async function createCoupon(input: CouponInput) {
  const res = await api.post<ApiResponse<Coupon>>('/coupons', input);
  return res.data.data!;
}
export async function updateCoupon(id: string, patch: Partial<CouponInput>) {
  const res = await api.patch<ApiResponse<Coupon>>(`/coupons/${id}`, patch);
  return res.data.data!;
}
export async function deleteCoupon(id: string) {
  await api.delete(`/coupons/${id}`);
}

// ---- Customers (admin) ----
export async function getCustomers() {
  const res = await api.get<PaginatedResponse<User>>('/admin/customers', { params: { limit: 50 } });
  return res.data.data ?? [];
}
