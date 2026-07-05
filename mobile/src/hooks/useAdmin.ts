import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as svc from '@/services/admin';

const invalidateProducts = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['admin', 'products'] });
  qc.invalidateQueries({ queryKey: ['products'] });
};

export const useDashboardSummary = () =>
  useQuery({ queryKey: ['admin', 'summary'], queryFn: svc.getDashboardSummary });

export const useBestSellers = () =>
  useQuery({ queryKey: ['admin', 'best-sellers'], queryFn: svc.getBestSellers });

export const useAdminProducts = () =>
  useQuery({ queryKey: ['admin', 'products'], queryFn: svc.getAdminProducts });

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.createProduct, onSuccess: () => invalidateProducts(qc) });
}
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; input: Partial<svc.ProductInput> }) => svc.updateProduct(v.id, v.input),
    onSuccess: () => invalidateProducts(qc),
  });
}
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.deleteProduct, onSuccess: () => invalidateProducts(qc) });
}

export const useAdminOrders = () =>
  useQuery({ queryKey: ['admin', 'orders'], queryFn: svc.getAdminOrders, refetchInterval: 20_000 });

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; status: Parameters<typeof svc.updateOrderStatus>[1] }) =>
      svc.updateOrderStatus(v.id, v.status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });
}

export const useAdminCoupons = () =>
  useQuery({ queryKey: ['admin', 'coupons'], queryFn: svc.getCoupons });

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.createCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }) });
}
export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; patch: Partial<svc.CouponInput> }) => svc.updateCoupon(v.id, v.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  });
}
export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.deleteCoupon, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }) });
}

export const useAdminCustomers = () =>
  useQuery({ queryKey: ['admin', 'customers'], queryFn: svc.getCustomers });
