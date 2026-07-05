import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types';
import type { RootStackParamList } from '@/navigation/types';
import { ProductImage } from './ProductImage';
import { useProductI18n } from '@/i18n/productI18n';
import { formatPrice } from '@/utils/format';
import { gradients } from '@/constants/theme';

function useCountdown() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const [ms, setMs] = useState(end.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setMs(Math.max(0, end.getTime() - Date.now())), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, '0'));
}

function FlashCard({ product }: { product: Product }) {
  const pi = useProductI18n();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const price = product.discountPrice ?? product.price;
  const pct = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const claimed = Math.min(92, Math.max(30, 100 - product.stock));
  const sellingFast = product.stock <= 25;

  return (
    <Pressable
      onPress={() => nav.navigate('ProductDetail', { slug: product.slug })}
      className="w-40 overflow-hidden rounded-3xl border border-white/15 bg-white/10"
    >
      <View className="relative aspect-square w-full">
        <ProductImage uri={product.images?.[0]?.url} className="h-full w-full" style={{ width: '100%', height: '100%' }} />
        {pct > 0 && (
          <View className="absolute left-2 top-2 rounded-full bg-sale px-2 py-0.5">
            <Text className="text-[10px] font-bold text-white">-{pct}%</Text>
          </View>
        )}
        {sellingFast && (
          <View className="absolute right-2 top-2 flex-row items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5">
            <Ionicons name="flame" size={10} color="#EF4444" />
            <Text className="text-[9px] font-bold text-sale">Fast</Text>
          </View>
        )}
      </View>
      <View className="p-3">
        <Text numberOfLines={1} className="text-sm font-semibold text-white">{pi.name(product)}</Text>
        <Text className="mt-1 text-base font-bold text-white">{formatPrice(price)}</Text>
        <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
          <View className="h-full rounded-full bg-cyan" style={{ width: `${claimed}%` }} />
        </View>
        <Text className="mt-1 text-[10px] text-white/70">Only {product.stock} left</Text>
      </View>
    </Pressable>
  );
}

export function FlashSaleRail({ products }: { products?: Product[] }) {
  const { t } = useTranslation();
  const [h, m, s] = useCountdown();
  if (!products || products.length === 0) return null;

  return (
    <View className="mt-6">
      <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="mx-4 rounded-3xl p-4" style={{ borderRadius: 24, padding: 16 }}>
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="flash" size={20} color="#22D3EE" />
            <Text className="text-lg font-bold text-white">{t('home.flashSale')}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            {[h, m, s].map((v, i) => (
              <View key={i} className="flex-row items-center">
                {i > 0 && <Text className="px-0.5 font-bold text-white/60">:</Text>}
                <View className="rounded-md bg-black/25 px-1.5 py-1">
                  <Text className="font-mono text-sm font-bold text-white">{v}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <FlatList
          horizontal
          data={products.slice(0, 8)}
          keyExtractor={(p) => p.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => <FlashCard product={item} />}
        />
      </LinearGradient>
    </View>
  );
}
