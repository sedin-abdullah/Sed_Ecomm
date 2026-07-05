import { api } from './api';
import type { ApiResponse, Cart, SelectedVariant } from '@/types';

export async function getCart() {
  const res = await api.get<ApiResponse<Cart>>('/cart');
  return res.data.data ?? null;
}

export async function addCartItem(productId: string, qty = 1, variant?: SelectedVariant) {
  const res = await api.post<ApiResponse<Cart>>('/cart/items', { productId, qty, variant });
  return res.data.data;
}

export async function updateCartItem(itemId: string, qty: number) {
  const res = await api.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { qty });
  return res.data.data;
}

export async function removeCartItem(itemId: string) {
  const res = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
  return res.data.data;
}

export async function applyCoupon(code: string) {
  const res = await api.post<ApiResponse<Cart>>('/cart/apply-coupon', { code });
  return res.data.data;
}

export async function removeCoupon() {
  const res = await api.post<ApiResponse<Cart>>('/cart/remove-coupon');
  return res.data.data;
}
