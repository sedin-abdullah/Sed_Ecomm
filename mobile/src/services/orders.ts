import { api } from './api';
import type { Address, ApiResponse, Order, PaginatedResponse, PaymentMethod } from '@/types';

export async function getAddresses() {
  const res = await api.get<ApiResponse<Address[]>>('/users/addresses');
  return res.data.data ?? [];
}

export async function addAddress(address: Omit<Address, 'id'>) {
  const res = await api.post<ApiResponse<Address>>('/users/addresses', address);
  return res.data.data!;
}

export async function updateAddress(id: string, patch: Partial<Omit<Address, 'id'>>) {
  const res = await api.patch<ApiResponse<Address>>(`/users/addresses/${id}`, patch);
  return res.data.data!;
}

export async function deleteAddress(id: string) {
  await api.delete(`/users/addresses/${id}`);
}

export async function placeOrder(payload: { addressId: string; couponCode?: string; paymentMethod: PaymentMethod }) {
  const res = await api.post<ApiResponse<Order>>('/orders', payload);
  return res.data.data!;
}

export async function getOrders() {
  const res = await api.get<PaginatedResponse<Order>>('/orders');
  return res.data.data ?? [];
}

export async function getOrder(id: string) {
  const res = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return res.data.data ?? null;
}

export async function getOrderTracking(id: string) {
  const res = await api.get<ApiResponse<{ status: string; label: string; timestamp: string }[]>>(`/orders/${id}/track`);
  return res.data.data ?? [];
}

export async function cancelOrder(id: string) {
  await api.post(`/orders/${id}/cancel`);
}

export async function returnOrder(id: string) {
  await api.post(`/orders/${id}/return`);
}

// ---- Dummy payment (same flow as web) ----
export async function initiatePayment(orderId: string, method: PaymentMethod, details?: Record<string, string>) {
  const res = await api.post<ApiResponse<{ paymentId: string; requiresOtp: boolean; status: string }>>(
    '/payments/initiate',
    { orderId, method, details },
  );
  return res.data.data!;
}

export async function verifyPayment(paymentId: string, otp?: string) {
  const res = await api.post<ApiResponse<{ paymentStatus: string; orderStatus: string }>>('/payments/verify', {
    paymentId,
    otp,
  });
  return res.data.data!;
}
