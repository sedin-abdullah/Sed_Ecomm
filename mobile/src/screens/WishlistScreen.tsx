import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '@/components/GradientBackground';
import { LoginPrompt } from '@/components/LoginPrompt';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/Button';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store/authStore';
import { useProductI18n } from '@/i18n/productI18n';
import { formatPrice } from '@/utils/format';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

export function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pi = useProductI18n();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: products, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  if (!isAuthenticated) return <LoginPrompt message="Log in to view your wishlist" />;

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1">
        <Text className="px-4 pb-2 text-2xl font-bold text-foreground">{t('nav.wishlist')}</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.brand} className="mt-16" />
        ) : !products || products.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4 px-8">
            <Ionicons name="heart-outline" size={40} color={colors.muted} />
            <Text className="text-muted-foreground">Your wishlist is empty.</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(p) => p.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => {
              const out = item.stock <= 0;
              return (
                <View className="flex-row gap-3 rounded-3xl border border-glass-border/10 bg-glass/[0.06] p-3">
                  <Pressable onPress={() => nav.navigate('ProductDetail', { slug: item.slug })}>
                    <ProductImage uri={item.images?.[0]?.url} className="h-20 w-20 rounded-2xl" style={{ width: 80, height: 80, borderRadius: 16 }} />
                  </Pressable>
                  <View className="flex-1">
                    <Text numberOfLines={1} className="font-medium text-foreground">{pi.name(item)}</Text>
                    <Text className="mt-0.5 font-bold text-foreground">{formatPrice(item.discountPrice ?? item.price)}</Text>
                    <Text className={`mt-0.5 text-xs ${out ? 'text-sale' : 'text-emerald'}`}>
                      {out ? t('product.outOfStock') : t('product.inStock')}
                    </Text>
                    <View className="mt-2 flex-row items-center gap-2">
                      <Pressable
                        disabled={out}
                        onPress={() =>
                          addToCart.mutate({ productId: item.id, qty: 1 }, { onSuccess: () => removeFromWishlist.mutate(item.id) })
                        }
                        className={`rounded-full px-4 py-1.5 ${out ? 'bg-glass/5' : 'bg-brand-500'}`}
                      >
                        <Text className="text-xs font-semibold text-white">Move to cart</Text>
                      </Pressable>
                      <Pressable onPress={() => removeFromWishlist.mutate(item.id)}>
                        <Ionicons name="trash-outline" size={18} color={colors.sale} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </GradientBackground>
  );
}
