import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as svc from '@/services/orders';
import { useAuthStore } from '@/store/authStore';

const ORDER_POLL_MS = 15_000;

export function useAddresses() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ queryKey: ['addresses'], queryFn: svc.getAddresses, enabled: isAuthenticated });
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.addAddress, onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }) });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; patch: Parameters<typeof svc.updateAddress>[1] }) => svc.updateAddress(v.id, v.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.deleteAddress, onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }) });
}

export function useOrders() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ queryKey: ['orders'], queryFn: svc.getOrders, enabled: isAuthenticated });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => svc.getOrder(id!),
    enabled: !!id,
    refetchInterval: ORDER_POLL_MS, // live status updates from admin
  });
}

export function useOrderTracking(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'track', id],
    queryFn: () => svc.getOrderTracking(id!),
    enabled: !!id,
    refetchInterval: ORDER_POLL_MS,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: svc.placeOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: svc.cancelOrder, onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }) });
}
