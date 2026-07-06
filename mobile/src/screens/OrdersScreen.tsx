import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useOrders } from '@/hooks/useOrders';
import { usePrice } from '@/hooks/usePrice';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#3B82F6',
  shipped: '#22D3EE',
  delivered: '#10B981',
  cancelled: '#EF4444',
  returned: '#94A3B8',
};

export function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const formatPrice = usePrice();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: orders, isLoading } = useOrders();

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top }} className="flex-row items-center gap-3 px-4 py-2">
        <Pressable onPress={() => nav.goBack()} className="rounded-full border border-glass-border/10 bg-glass/[0.06] p-2">
          <Ionicons name="chevron-back" size={20} color={tc.foreground} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">My Orders</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator color={colors.brand} className="mt-16" />
      ) : !orders || orders.length === 0 ? (
        <Text className="mt-16 text-center text-muted-foreground">You haven't placed any orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => nav.navigate('OrderDetail', { id: item.id })}
              className="flex-row items-center justify-between rounded-3xl border border-glass-border/10 bg-glass/[0.06] p-4"
            >
              <View>
                <Text className="font-medium text-foreground">#{item.id.slice(-8).toUpperCase()}</Text>
                <Text className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()} · {item.items.length} item(s)
                </Text>
              </View>
              <View className="items-end gap-1">
                <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${STATUS_COLOR[item.status] ?? colors.muted}22` }}>
                  <Text style={{ color: STATUS_COLOR[item.status] ?? colors.muted }} className="text-xs font-medium capitalize">{item.status}</Text>
                </View>
                <Text className="font-bold text-foreground">{formatPrice(item.total)}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </GradientBackground>
  );
}
