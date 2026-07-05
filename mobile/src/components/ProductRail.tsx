import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Product } from '@/types';
import type { RootStackParamList } from '@/navigation/types';
import { ProductCard } from './ProductCard';

/** Horizontal, lazily-rendered rail of product cards (Home sections). */
export function ProductRail({ title, products }: { title: string; products?: Product[] }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  if (!products || products.length === 0) return null;
  return (
    <View className="mt-6">
      <Text className="mb-3 px-4 text-lg font-semibold text-foreground">{title}</Text>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(p) => p.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        initialNumToRender={4}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            index={index}
            width={150}
            onPress={() => nav.navigate('ProductDetail', { slug: item.slug })}
          />
        )}
      />
    </View>
  );
}
