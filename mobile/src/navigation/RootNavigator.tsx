import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { ProductDetailScreen } from '@/screens/ProductDetailScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { PaymentScreen } from '@/screens/PaymentScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { OrderDetailScreen } from '@/screens/OrderDetailScreen';
import { AdminDashboardScreen } from '@/screens/admin/AdminDashboardScreen';
import { AdminProductsScreen } from '@/screens/admin/AdminProductsScreen';
import { AdminOrdersScreen } from '@/screens/admin/AdminOrdersScreen';
import { AdminCouponsScreen } from '@/screens/admin/AdminCouponsScreen';
import { AdminCustomersScreen } from '@/screens/admin/AdminCustomersScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Single root stack. The main app (tabs) is always browsable; auth is a modal
 * pushed when a screen needs a logged-in user (mirrors the web app, where
 * browsing is public and cart/checkout require login).
 */
export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminCoupons" component={AdminCouponsScreen} />
      <Stack.Screen name="AdminCustomers" component={AdminCustomersScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}
