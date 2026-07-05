import type { PaymentMethod } from '@/types';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { slug: string };
  Search: undefined;
  Checkout: undefined;
  Payment: { addressId: string; couponCode?: string };
  Orders: undefined;
  OrderDetail: { id: string };
  Auth: { screen?: keyof AuthStackParamList } | undefined;
  AdminDashboard: undefined;
  AdminProducts: undefined;
  AdminOrders: undefined;
  AdminCoupons: undefined;
  AdminCustomers: undefined;
};

export type TabParamList = {
  Home: undefined;
  Shop: { category?: string } | undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Forgot: undefined;
};

export type PaymentDetails = { method: PaymentMethod };
