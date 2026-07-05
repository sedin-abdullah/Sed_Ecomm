import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/Button';
import { useOrder, useOrderTracking, useCancelOrder } from '@/hooks/useOrders';
import { useProductI18n } from '@/i18n/productI18n';
import { formatPrice } from '@/utils/format';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { OrderItem } from '@/types';

export function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const nav = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'OrderDetail'>>();
  const pi = useProductI18n();
  const { data: order, isLoading } = useOrder(params.id);
  const { data: tracking } = useOrderTracking(params.id);
  const cancel = useCancelOrder();

  if (isLoading || !order) {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center"><ActivityIndicator color={colors.brand} size="large" /></View>
      </GradientBackground>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top }} className="flex-row items-center gap-3 px-4 py-2">
        <Pressable onPress={() => nav.goBack()} className="rounded-full border border-glass-border/10 bg-glass/[0.06] p-2">
          <Ionicons name="chevron-back" size={20} color={tc.foreground} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">Order #{order.id.slice(-8).toUpperCase()}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        {/* Status timeline */}
        <View className="rounded-3xl border border-glass-border/10 bg-glass/[0.06] p-4">
          <Text className="mb-3 font-semibold text-foreground">Tracking</Text>
          {(tracking ?? []).map((ev: { status: string; label: string; timestamp: string }, i: number) => (
            <View key={i} className="flex-row items-start gap-3 pb-3">
              <View className="mt-1 h-3 w-3 rounded-full bg-brand-500" />
              <View className="flex-1">
                <Text className="font-medium capitalize text-foreground">{ev.status}</Text>
                <Text className="text-xs text-muted-foreground">{new Date(ev.timestamp).toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Items */}
        <View className="rounded-3xl border border-glass-border/10 bg-glass/[0.06] p-4">
          <Text className="mb-3 font-semibold text-foreground">Items</Text>
          {order.items.map((item: OrderItem) => (
            <View key={item.id} className="flex-row items-center gap-3 py-2">
              <ProductImage uri={item.image} className="h-12 w-12 rounded-xl" style={{ width: 48, height: 48, borderRadius: 12 }} />
              <View className="flex-1">
                <Text numberOfLines={1} className="text-foreground">{pi.rawName(item.name)}</Text>
                <Text className="text-xs text-muted-foreground">Qty {item.qty}</Text>
              </View>
              <Text className="font-medium text-foreground">{formatPrice(item.price * item.qty)}</Text>
            </View>
          ))}
          <View className="mt-2 flex-row justify-between border-t border-glass-border/10 pt-2">
            <Text className="font-bold text-foreground">Total</Text>
            <Text className="font-bold text-foreground">{formatPrice(order.total)}</Text>
          </View>
        </View>

        {canCancel && (
          <Button
            variant="glass"
            onPress={() =>
              Alert.alert('Cancel order?', 'This cannot be undone.', [
                { text: 'Keep', style: 'cancel' },
                { text: 'Cancel order', style: 'destructive', onPress: () => cancel.mutate(order.id) },
              ])
            }
          >
            Cancel order
          </Button>
        )}
      </ScrollView>
    </GradientBackground>
  );
}
