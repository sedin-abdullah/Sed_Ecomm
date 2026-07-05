import { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { ProductCard } from '@/components/ProductCard';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useProductI18n } from '@/i18n/productI18n';
import type { ProductFilters } from '@/types';
import type { RootStackParamList, TabParamList } from '@/navigation/types';
import { colors } from '@/constants/theme';

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<TabParamList, 'Shop'>>();
  const pi = useProductI18n();
  const categories = useCategories();
  const [filters, setFilters] = useState<ProductFilters>({ category: route.params?.category });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts(filters);
  const products = useMemo(() => data?.pages.flatMap((p) => p.data ?? []) ?? [], [data]);

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1">
        <View className="flex-row items-center justify-between px-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">Shop</Text>
          <Pressable onPress={() => nav.navigate('Search')} className="rounded-full border border-glass-border/10 bg-glass/[0.06] p-2.5">
            <Ionicons name="search" size={18} color={colors.muted} />
          </Pressable>
        </View>

        {/* Category chips */}
        <FlatList
          horizontal
          data={[{ id: 'all', name: 'All', slug: undefined as string | undefined }, ...(categories.data ?? [])]}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 48 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item }) => {
            const active = filters.category === item.slug;
            return (
              <Pressable
                onPress={() => setFilters((f) => ({ ...f, category: item.slug }))}
                className={`h-9 justify-center rounded-full border px-4 ${active ? 'border-brand-500 bg-brand-500/20' : 'border-glass-border/10 bg-glass/[0.06]'}`}
              >
                <Text className={active ? 'text-sm font-medium text-brand-400' : 'text-sm text-secondary'}>
                  {item.slug ? pi.category(item.name) : item.name}
                </Text>
              </Pressable>
            );
          }}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.brand} size="large" />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(p) => p.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
            contentContainerStyle={{ gap: 12, paddingTop: 12, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<Text className="mt-16 text-center text-muted-foreground">No products match these filters.</Text>}
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.brand} className="my-4" /> : null}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1 }}>
                <ProductCard product={item} index={index} onPress={() => nav.navigate('ProductDetail', { slug: item.slug })} />
              </View>
            )}
          />
        )}
      </View>
    </GradientBackground>
  );
}
