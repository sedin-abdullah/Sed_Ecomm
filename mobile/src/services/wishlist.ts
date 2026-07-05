import { api } from './api';
import type { ApiResponse, Product } from '@/types';

export async function getWishlist() {
  // Backend returns the wishlist document ({ products: [...] }), not a bare array.
  const res = await api.get<ApiResponse<{ products: Product[] }>>('/wishlist');
  return res.data.data?.products ?? [];
}

export async function addToWishlist(productId: string) {
  await api.post(`/wishlist/${productId}`);
}

export async function removeFromWishlist(productId: string) {
  await api.delete(`/wishlist/${productId}`);
}
