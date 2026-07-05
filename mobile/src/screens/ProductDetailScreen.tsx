import { useState } from 'react';
import { ScrollView, View, Text, Pressable, Dimensions, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '@/components/GradientBackground';
import { ProductImage } from '@/components/ProductImage';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/store/authStore';
import { useProductI18n } from '@/i18n/productI18n';
import { getApiErrorMessage } from '@/services/api';
import { formatPrice } from '@/utils/format';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { ProductImage as ProductImageType } from '@/types';

const { width } = Dimensions.get('window');

export function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const pi = useProductI18n();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: product, isLoading } = useProduct(params.slug);
  const related = useRelatedProducts(product?.id);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string>();

  function requireAuth(action: () => void) {
    if (!isAuthenticated) {
      nav.navigate('Auth', undefined);
      return;
    }
    action();
  }

  if (isLoading || !product) {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      </GradientBackground>
    );
  }

  const price = product.discountPrice ?? product.price;
  const outOfStock = product.stock <= 0;

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top }} className="flex-row items-center justify-between px-4 py-2">
        <Pressable onPress={() => nav.goBack()} className="rounded-full border border-white/10 bg-white/[0.06] p-2">
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() =>
            requireAuth(() =>
              addToWishlist.mutate(product.id, {
                onSuccess: ({ alreadyExists }) =>
                  Alert.alert(alreadyExists ? 'Already in wishlist' : 'Added to wishlist ❤️'),
              }),
            )
          }
          className="rounded-full border border-white/10 bg-white/[0.06] p-2"
        >
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image slider */}
        <FlatList
          horizontal
          pagingEnabled
          data={product.images}
          keyExtractor={(img) => img.id}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setActiveImg(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => (
            <ProductImage uri={item.url} style={{ width, height: width }} />
          )}
        />
        {product.images.length > 1 && (
          <View className="mt-3 flex-row justify-center gap-1.5">
            {product.images.map((img: ProductImageType, i: number) => (
              <View key={img.id} className={`h-1.5 rounded-full ${i === activeImg ? 'w-5 bg-brand-500' : 'w-1.5 bg-white/25'}`} />
            ))}
          </View>
        )}

        <View className="px-4 pt-4">
          {product.brand ? <Text className="text-xs uppercase text-muted-foreground">{product.brand}</Text> : null}
          <Text className="mt-1 text-2xl font-bold text-foreground">{pi.name(product)}</Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Text className="text-yellow-400">★</Text>
            <Text className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} · {product.numReviews} {t('product.reviews')}
            </Text>
          </View>
          <View className="mt-3 flex-row items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">{formatPrice(price)}</Text>
            {product.discountPrice ? <Text className="text-base text-muted-foreground line-through">{formatPrice(product.price)}</Text> : null}
          </View>
          <Text className={`mt-1 text-sm font-medium ${outOfStock ? 'text-sale' : 'text-emerald'}`}>
            {outOfStock ? t('product.outOfStock') : t('product.inStock')}
          </Text>

          <Text className="mt-4 leading-6 text-secondary">{pi.description(product)}</Text>

          {/* Sizes */}
          {product.variants?.sizes?.length ? (
            <View className="mt-5">
              <Text className="mb-2 font-semibold text-foreground">Size</Text>
              <View className="flex-row flex-wrap gap-2">
                {product.variants.sizes.map((s: string) => (
                  <Pressable
                    key={s}
                    onPress={() => setSize((cur) => (cur === s ? undefined : s))}
                    className={`rounded-xl border px-4 py-2 ${size === s ? 'border-brand-500 bg-brand-500/20' : 'border-white/10'}`}
                  >
                    <Text className={size === s ? 'text-brand-400' : 'text-secondary'}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* Colors */}
          {product.variants?.colors?.length ? (
            <View className="mt-4">
              <Text className="mb-2 font-semibold text-foreground">Color</Text>
              <View className="flex-row flex-wrap gap-2">
                {product.variants.colors.map((c: string) => (
                  <Pressable
                    key={c}
                    onPress={() => setColor((cur) => (cur === c ? undefined : c))}
                    className={`rounded-xl border px-4 py-2 ${color === c ? 'border-brand-500 bg-brand-500/20' : 'border-white/10'}`}
                  >
                    <Text className={color === c ? 'text-brand-400' : 'text-secondary'}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        {related.data && related.data.length > 0 && (
          <View className="mt-8">
            <Text className="mb-3 px-4 text-lg font-semibold text-foreground">{t('product.related')}</Text>
            <FlatList
              horizontal
              data={related.data}
              keyExtractor={(p) => p.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              renderItem={({ item, index }) => (
                <ProductCard product={item} index={index} width={150} onPress={() => nav.push('ProductDetail', { slug: item.slug })} />
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Sticky add-to-cart bar */}
      <View style={{ paddingBottom: insets.bottom + 8 }} className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-surface/95 px-4 pt-3">
        <Button
          onPress={() =>
            requireAuth(() =>
              addToCart.mutate(
                { productId: product.id, qty: 1, variant: size || color ? { size, color } : undefined },
                {
                  onSuccess: () => Alert.alert('Added to cart'),
                  onError: (e) => Alert.alert('Error', getApiErrorMessage(e)),
                },
              ),
            )
          }
          loading={addToCart.isPending}
          disabled={outOfStock}
        >
          {outOfStock ? t('product.outOfStock') : t('common.addToCart')}
        </Button>
      </View>
    </GradientBackground>
  );
}
