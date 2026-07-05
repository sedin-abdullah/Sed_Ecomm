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
import { formatPrice } from '@/utils/format';
import { colors } from '@/constants/theme';
import type { Order, OrderStatus } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export function AdminOrdersScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

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
            {orders.map((o: Order) => (
              <GlassCard key={o.id} className="mb-3 p-4">
                <View className="flex-row justify-between">
                  <Text className="font-medium text-foreground">#{o.id.slice(-8).toUpperCase()}</Text>
                  <Text className="font-semibold text-foreground">{formatPrice(o.total)}</Text>
                </View>
                <Text className="mt-1 text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s) · {o.paymentMethod}
                </Text>
                <View className="mt-3 flex-row items-center justify-between">
                  <View className="rounded-full bg-brand-500/20 px-3 py-1">
                    <Text className="text-xs font-medium text-brand-400">{o.status}</Text>
                  </View>
                  <Pressable onPress={() => changeStatus(o.id)} className="rounded-full border border-glass-border/[0.15] px-3 py-1.5">
                    <Text className="text-xs font-medium text-foreground">Update status</Text>
                  </Pressable>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        )}
      </View>
    </GradientBackground>
  );
}
