import { useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { GlassCard } from '@/components/GlassCard';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { getApiErrorMessage } from '@/services/api';
import { usePrice } from '@/hooks/usePrice';
import { colors } from '@/constants/theme';
import type { Order, OrderItem, OrderStatus } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export function AdminOrdersScreen() {
  const insets = useSafeAreaInsets();
  const formatPrice = usePrice();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [expanded, setExpanded] = useState<string | null>(null);

  function changeStatus(id: string) {
    Alert.alert('Update status', 'Set the order status:', [
      ...STATUSES.map((s) => ({
        text: s,
        onPress: () => updateStatus.mutate({ id, status: s }, { onError: (e) => Alert.alert('Error', getApiErrorMessage(e)) }),
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  }

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1">
        <View className="flex-row items-center gap-2 px-4 pb-2">
          <Pressable onPress={() => nav.goBack()} className="h-10 w-10 items-center justify-center rounded-full bg-glass/[0.06]">
            <Ionicons name="chevron-back" size={22} color={tc.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Orders</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.brand} className="mt-10" />
        ) : !orders?.length ? (
          <Text className="mt-10 text-center text-muted-foreground">No orders yet.</Text>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {orders.map((o: Order) => {
              const itemCount = o.items.reduce((n, it) => n + it.qty, 0);
              const isOpen = expanded === o.id;
              const addr = o.shippingAddress;
              return (
                <GlassCard key={o.id} className="mb-3 p-4">
                  <Pressable onPress={() => setExpanded(isOpen ? null : o.id)}>
                    <View className="flex-row justify-between">
                      <Text className="font-medium text-foreground">#{o.id.slice(-8).toUpperCase()}</Text>
                      <Text className="font-semibold text-foreground">{formatPrice(o.total)}</Text>
                    </View>
                    <Text className="mt-0.5 text-sm text-foreground">{o.user?.name ?? 'Customer'}</Text>
                    {!!o.user?.email && <Text className="text-xs text-muted-foreground">{o.user.email}</Text>}
                    <Text className="mt-1 text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()} · {itemCount} item{itemCount === 1 ? '' : 's'} · {o.paymentMethod}
                    </Text>
                  </Pressable>

                  <View className="mt-3 flex-row items-center justify-between">
                    <View className="rounded-full bg-brand-500/20 px-3 py-1">
                      <Text className="text-xs font-medium text-brand-400">{o.status}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Pressable onPress={() => changeStatus(o.id)} className="rounded-full border border-glass-border/[0.15] px-3 py-1.5">
                        <Text className="text-xs font-medium text-foreground">Update status</Text>
                      </Pressable>
                      <Pressable onPress={() => setExpanded(isOpen ? null : o.id)} className="p-1">
                        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
                      </Pressable>
                    </View>
                  </View>

                  {isOpen && (
                    <View className="mt-3 border-t border-glass-border/10 pt-3">
                      <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</Text>
                      {o.items.map((it: OrderItem) => (
                        <View key={it.id} className="flex-row items-center justify-between py-0.5">
                          <Text className="flex-1 pr-2 text-sm text-foreground" numberOfLines={1}>
                            {it.name} <Text className="text-muted-foreground">× {it.qty}</Text>
                          </Text>
                          <Text className="text-sm text-secondary">{formatPrice(it.price * it.qty)}</Text>
                        </View>
                      ))}
                      <View className="mt-2 border-t border-glass-border/10 pt-2">
                        <View className="flex-row justify-between py-0.5">
                          <Text className="text-xs text-muted-foreground">Subtotal</Text>
                          <Text className="text-xs text-secondary">{formatPrice(o.subtotal)}</Text>
                        </View>
                        {!!o.discount && (
                          <View className="flex-row justify-between py-0.5">
                            <Text className="text-xs text-emerald">Discount{o.couponCode ? ` (${o.couponCode})` : ''}</Text>
                            <Text className="text-xs text-emerald">-{formatPrice(o.discount)}</Text>
                          </View>
                        )}
                        <View className="flex-row justify-between py-0.5">
                          <Text className="text-xs font-semibold text-foreground">Total</Text>
                          <Text className="text-xs font-semibold text-foreground">{formatPrice(o.total)}</Text>
                        </View>
                      </View>

                      {addr && (
                        <View className="mt-3">
                          <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipping address</Text>
                          <Text className="text-sm text-foreground">{addr.fullName}</Text>
                          <Text className="text-xs text-muted-foreground">{addr.phone}</Text>
                          <Text className="text-xs text-muted-foreground">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                          </Text>
                          <Text className="text-xs text-muted-foreground">
                            {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </GlassCard>
              );
            })}
          </ScrollView>
        )}
      </View>
    </GradientBackground>
  );
}
