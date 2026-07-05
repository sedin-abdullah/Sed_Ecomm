import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as svc from '@/services/wishlist';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import type { Product } from '@/types';

const KEY = ['wishlist'];

export function useWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setWishlistCount = useUiStore((s) => s.setWishlistCount);
  const query = useQuery({ queryKey: KEY, queryFn: svc.getWishlist, enabled: isAuthenticated });

  useEffect(() => {
    setWishlistCount(isAuthenticated ? query.data?.length ?? 0 : 0);
  }, [query.data, isAuthenticated, setWishlistCount]);

  return query;
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    // Detect an existing entry from cache so callers can say "already in wishlist".
    mutationFn: async (productId: string) => {
      const current = qc.getQueryData<Product[]>(KEY) ?? [];
      const alreadyExists = current.some((p) => p.id === productId);
      if (!alreadyExists) await svc.addToWishlist(productId);
      return { alreadyExists };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: svc.removeFromWishlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
