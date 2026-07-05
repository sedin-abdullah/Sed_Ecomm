import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as svc from '@/services/products';
import type { ProductFilters } from '@/types';

export function useProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['products', 'list', filters],
    queryFn: ({ pageParam }) => svc.fetchProducts(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['products', 'detail', slug],
    queryFn: () => svc.fetchProductBySlug(slug!),
    enabled: !!slug,
  });
}

export function useRelatedProducts(id: string | undefined) {
  return useQuery({
    queryKey: ['products', 'related', id],
    queryFn: () => svc.fetchRelatedProducts(id!),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: svc.fetchCategories, staleTime: 60_000 });
}

export function useFacets() {
  return useQuery({ queryKey: ['facets'], queryFn: svc.fetchFacets, staleTime: 60_000 });
}

export function useSuggestions(q: string) {
  return useQuery({
    queryKey: ['suggest', q],
    queryFn: () => svc.fetchSuggestions(q),
    enabled: q.trim().length >= 2,
    staleTime: 60_000,
  });
}

const row = (key: string, params: Parameters<typeof svc.fetchProductRow>[0]) => ({
  queryKey: ['row', key, params],
  queryFn: () => svc.fetchProductRow(params),
  staleTime: 60_000,
});

export const useFlashSale = () => useQuery(row('flash', { sort: 'price_asc', onSale: true }));
export const useTrending = () => useQuery(row('trending', { sort: 'popular' }));
export const useNewArrivals = () => useQuery(row('new', { sort: 'newest' }));
export const useBestSellers = () => useQuery(row('best', { sort: 'popular', limit: 8 }));
export const useRecommended = () => useQuery(row('reco', { sort: 'rating' }));
