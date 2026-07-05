import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as svc from '@/services/cart';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import type { CartItem, SelectedVariant } from '@/types';

const KEY = ['cart'];

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setCartCount = useUiStore((s) => s.setCartCount);
  const query = useQuery({ queryKey: KEY, queryFn: svc.getCart, enabled: isAuthenticated });

  useEffect(() => {
    if (!isAuthenticated) return setCartCount(0);
    const count =
      query.data?.items.filter((i: CartItem) => !i.savedForLater).reduce((s: number, i: CartItem) => s + i.qty, 0) ?? 0;
    setCartCount(count);
  }, [query.data, isAuthenticated, setCartCount]);

  return query;
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { productId: string; qty?: number; variant?: SelectedVariant }) =>
      svc.addCartItem(v.productId, v.qty ?? 1, v.variant),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { itemId: string; qty: number }) => svc.updateCartItem(v.itemId, v.qty),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: svc.removeCartItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useApplyCoupon() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.applyCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) });
}

export function useRemoveCoupon() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.removeCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) });
}
