import { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '@/components/GradientBackground';
import { LoginPrompt } from '@/components/LoginPrompt';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/Button';
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useApplyCoupon,
  useRemoveCoupon,
} from '@/hooks/useCart';
import { useAddToWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/store/authStore';
import { useProductI18n } from '@/i18n/productI18n';
import { usePrice } from '@/hooks/usePrice';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { CartItem } from '@/types';

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={accent ? 'text-emerald' : 'text-muted-foreground'}>{label}</Text>
      <Text className={accent ? 'text-emerald' : 'text-secondary'}>{value}</Text>
    </View>
  );
}

export function CartScreen() {
  const insets = useSafeAreaInsets();
  const formatPrice = usePrice();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pi = useProductI18n();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const addToWishlist = useAddToWishlist();
  const [coupon, setCoupon] = useState('');

  if (!isAuthenticated) return <LoginPrompt message="Log in to view your cart" />;
  if (isLoading) {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      </GradientBackground>
    );
  }

  const items = cart?.items.filter((i: CartItem) => !i.savedForLater) ?? [];

  if (!cart || items.length === 0) {
    return (
      <GradientBackground>
        <View style={{ paddingTop: insets.top }} className="flex-1 items-center justify-center gap-4 px-8">
          <Ionicons name="bag-outline" size={40} color={colors.muted} />
          <Text className="text-lg text-muted-foreground">{t('cart.empty')}</Text>
          <Button onPress={() => nav.navigate('MainTabs', { screen: 'Shop' } as never)} className="w-48">
            {t('common.viewAll')}
          </Button>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1">
        <Text className="px-4 pb-2 text-2xl font-bold text-foreground">{t('cart.title')}</Text>
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 280 }}
          renderItem={({ item }) => {
            const unit = item.product.discountPrice ?? item.product.price;
            return (
              <View className="flex-row gap-3 rounded-3xl border border-glass-border/10 bg-glass/[0.06] p-3">
                <ProductImage uri={item.product.images?.[0]?.url} className="h-20 w-20 rounded-2xl" style={{ width: 80, height: 80, borderRadius: 16 }} />
                <View className="flex-1">
                  <Text numberOfLines={1} className="font-medium text-foreground">{pi.name(item.product)}</Text>
                  <Text className="mt-0.5 font-bold text-foreground">{formatPrice(unit * item.qty)}</Text>
                  <View className="mt-2 flex-row items-center gap-3">
                    <View className="flex-row items-center rounded-full border border-glass-border/10">
                      <Pressable onPress={() => item.qty > 1 && updateItem.mutate({ itemId: item.id, qty: item.qty - 1 })} className="px-3 py-1">
                        <Text className="text-lg text-foreground">−</Text>
                      </Pressable>
                      <Text className="min-w-6 text-center text-foreground">{item.qty}</Text>
                      <Pressable onPress={() => updateItem.mutate({ itemId: item.id, qty: item.qty + 1 })} className="px-3 py-1">
                        <Text className="text-lg text-foreground">＋</Text>
                      </Pressable>
                    </View>
                    <Pressable onPress={() => addToWishlist.mutate(item.product.id, { onSuccess: () => removeItem.mutate(item.id) })}>
                      <Ionicons name="heart-outline" size={18} color={colors.muted} />
                    </Pressable>
                    <Pressable onPress={() => removeItem.mutate(item.id)}>
                      <Ionicons name="trash-outline" size={18} color={colors.sale} />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Summary */}
        <View style={{ paddingBottom: insets.bottom + 8 }} className="absolute bottom-0 left-0 right-0 border-t border-glass-border/10 bg-surface/95 px-4 pt-3">
          <View className="mb-2 flex-row gap-2">
            <View className="h-11 flex-1 justify-center rounded-2xl border border-glass-border/10 bg-glass/[0.06] px-3">
              <TextInput
                value={coupon}
                onChangeText={(v) => setCoupon(v.toUpperCase())}
                placeholder="Coupon code"
                placeholderTextColor={colors.muted}
                autoCapitalize="characters"
                className="text-foreground"
              />
            </View>
            <Pressable
              onPress={() => applyCoupon.mutate(coupon)}
              className="h-11 justify-center rounded-2xl border border-glass-border/10 bg-glass/[0.06] px-5"
            >
              <Text className="font-medium text-brand-400">{t('cart.applyCoupon')}</Text>
            </Pressable>
          </View>

          <Row label={t('cart.subtotal')} value={formatPrice(cart.subtotal)} />
          {!!cart.discount && (
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-emerald">{t('cart.discount')} {cart.couponCode ? `(${cart.couponCode})` : ''}</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-emerald">-{formatPrice(cart.discount)}</Text>
                <Pressable onPress={() => removeCoupon.mutate()}>
                  <Text className="text-xs text-muted-foreground underline">Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
          <Row label={`${t('cart.tax')} (8%)`} value={formatPrice(cart.tax ?? 0)} />
          <Row label={t('cart.shipping')} value={cart.shippingFee ? formatPrice(cart.shippingFee) : 'Free'} />
          <View className="mt-1 flex-row justify-between border-t border-glass-border/10 pt-2">
            <Text className="text-base font-bold text-foreground">{t('cart.total')}</Text>
            <Text className="text-base font-bold text-foreground">{formatPrice(cart.total)}</Text>
          </View>
          <Button onPress={() => nav.navigate('Checkout')} className="mt-3">
            {t('cart.checkout')}
          </Button>
        </View>
      </View>
    </GradientBackground>
  );
}
