import { api } from './api';
import type {
  ApiResponse,
  Category,
  PaginatedResponse,
  Product,
  ProductFilters,
} from '@/types';

const PAGE_LIMIT = 12;

export async function fetchProducts(filters: ProductFilters, page = 1) {
  const res = await api.get<PaginatedResponse<Product>>('/products', {
    params: { ...filters, page, limit: PAGE_LIMIT },
  });
  return res.data;
}

export async function fetchProductBySlug(slug: string) {
  const res = await api.get<ApiResponse<Product>>(`/products/${slug}`);
  return res.data.data ?? null;
}

export async function fetchRelatedProducts(id: string) {
  const res = await api.get<ApiResponse<Product[]>>(`/products/${id}/related`);
  return res.data.data ?? [];
}

export async function fetchCategories() {
  const res = await api.get<ApiResponse<Category[]>>('/categories');
  return res.data.data ?? [];
}

export interface ProductFacets {
  brands: string[];
  sizes: string[];
  colors: string[];
}
export async function fetchFacets() {
  const res = await api.get<ApiResponse<ProductFacets>>('/products/facets');
  return res.data.data ?? { brands: [], sizes: [], colors: [] };
}

export interface Suggestion {
  id: string;
  name: string;
  slug: string;
  image?: string;
}
export async function fetchSuggestions(q: string) {
  const res = await api.get<ApiResponse<Suggestion[]>>('/products/search/suggest', { params: { q } });
  return res.data.data ?? [];
}

/** Each home rail is a differently-sorted slice of the single /products endpoint. */
export async function fetchProductRow(params: ProductFilters & { limit?: number }) {
  const res = await api.get<PaginatedResponse<Product>>('/products', {
    params: { page: 1, limit: 10, ...params },
  });
  return res.data.data ?? [];
}
