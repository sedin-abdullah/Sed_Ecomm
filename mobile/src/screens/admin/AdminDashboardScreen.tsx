import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { GlassCard } from '@/components/GlassCard';
import { ProductImage } from '@/components/ProductImage';
import { useDashboardSummary, useBestSellers } from '@/hooks/useAdmin';
import type { BestSeller } from '@/services/admin';
import { formatPrice } from '@/utils/format';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <GlassCard className="mb-3 flex-1 p-4" style={{ minWidth: '46%' }}>
      <Text className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Text>
      <Text className="mt-1 text-xl font-bold text-foreground">{value}</Text>
    </GlassCard>
  );
}

const LINKS: { label: string; icon: keyof typeof Ionicons.glyphMap; route: keyof RootStackParamList }[] = [
  { label: 'Products', icon: 'cube-outline', route: 'AdminProducts' },
  { label: 'Orders', icon: 'receipt-outline', route: 'AdminOrders' },
  { label: 'Coupons', icon: 'pricetag-outline', route: 'AdminCoupons' },
  { label: 'Customers', icon: 'people-outline', route: 'AdminCustomers' },
];

export function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: s, isLoading } = useDashboardSummary();
  const { data: best } = useBestSellers();

  return (
    <GradientBackground>
      <ScrollView style={{ paddingTop: insets.top + 8 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="mb-4 flex-row items-center gap-2">
          <Pressable onPress={() => nav.goBack()} className="h-10 w-10 items-center justify-center rounded-full bg-glass/[0.06]">
            <Ionicons name="chevron-back" size={22} color={tc.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Admin Dashboard</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.brand} className="mt-10" />
        ) : (
          <>
            <View className="flex-row flex-wrap justify-between">
              <Stat label="Total Sales" value={formatPrice(s?.totalSales ?? 0)} />
              <Stat label="Daily Sales" value={formatPrice(s?.dailySales ?? 0)} />
              <Stat label="Monthly Sales" value={formatPrice(s?.monthlySales ?? 0)} />
              <Stat label="Total Orders" value={s?.totalOrders ?? 0} />
              <Stat label="Customers" value={s?.totalCustomers ?? 0} />
              <Stat label="Pending" value={s?.pendingOrders ?? 0} />
              <Stat label="Delivered" value={s?.deliveredOrders ?? 0} />
              <Stat label="Cancelled" value={s?.cancelledOrders ?? 0} />
            </View>

            <Text className="mb-2 mt-4 font-semibold text-foreground">Manage</Text>
            <View className="flex-row flex-wrap gap-3">
              {LINKS.map((l) => (
                <Pressable
                  key={l.route}
                  onPress={() => nav.navigate(l.route as never)}
                  className="flex-1 flex-row items-center gap-2 rounded-2xl border border-glass-border/10 bg-glass/[0.06] p-4"
                  style={{ minWidth: '46%' }}
                >
                  <Ionicons name={l.icon} size={20} color={colors.brand} />
                  <Text className="font-medium text-foreground">{l.label}</Text>
                </Pressable>
              ))}
            </View>

            {!!best?.length && (
              <>
                <Text className="mb-2 mt-6 font-semibold text-foreground">Best Sellers</Text>
                <GlassCard className="p-2">
                  {best.map(({ product, unitsSold }: BestSeller) => (
                    <View key={product.id} className="flex-row items-center gap-3 border-b border-glass-border/5 p-2">
                      <ProductImage uri={product.images?.[0]?.url} style={{ width: 40, height: 40, borderRadius: 8 }} />
                      <Text className="flex-1 text-sm text-foreground" numberOfLines={1}>{product.name}</Text>
                      <Text className="text-xs text-muted-foreground">{unitsSold} sold</Text>
                    </View>
                  ))}
                </GlassCard>
              </>
            )}
          </>
        )}
      </ScrollView>
    </GradientBackground>
  );
}
