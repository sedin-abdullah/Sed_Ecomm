import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Product } from '@/types';
import { ProductImage } from './ProductImage';
import { useProductI18n } from '@/i18n/productI18n';
import { usePrice } from '@/hooks/usePrice';

interface Props {
  product: Product;
  onPress: () => void;
  index?: number;
  width?: number;
}

/** Premium product card: glass surface, image, price with discount, rating. */
export function ProductCard({ product, onPress, index = 0, width }: Props) {
  const formatPrice = usePrice();
  const pi = useProductI18n();
  const price = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 40, 300)).springify()} style={width ? { width } : undefined}>
      <Pressable onPress={onPress} className="overflow-hidden rounded-3xl border border-glass-border/10 bg-glass/[0.06]">
        <View className="relative aspect-square w-full">
          <ProductImage uri={product.images?.[0]?.url} className="h-full w-full" style={{ width: '100%', height: '100%' }} />
          {hasDiscount && (
            <View className="absolute left-2 top-2 rounded-full bg-sale px-2 py-0.5">
              <Text className="text-[10px] font-bold text-white">
                -{Math.round((1 - price / product.price) * 100)}%
              </Text>
            </View>
          )}
        </View>
        <View className="p-3">
          {product.brand ? <Text className="text-[10px] uppercase text-muted-foreground">{product.brand}</Text> : null}
          <Text numberOfLines={1} className="mt-0.5 text-sm font-medium text-foreground">
            {pi.name(product)}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Text className="text-yellow-400 text-xs">★</Text>
            <Text className="text-xs text-muted-foreground">
              {product.rating?.toFixed(1) ?? '0.0'} ({product.numReviews ?? 0})
            </Text>
          </View>
          <View className="mt-1.5 flex-row items-center gap-2">
            <Text className="text-base font-bold text-foreground">{formatPrice(price)}</Text>
            {hasDiscount && (
              <Text className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
