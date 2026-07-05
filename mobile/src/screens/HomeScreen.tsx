import { ScrollView, View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientBackground } from '@/components/GradientBackground';
import { ProductRail } from '@/components/ProductRail';
import { ProductImage } from '@/components/ProductImage';
import { FlashSaleRail } from '@/components/FlashSaleRail';
import { useProductI18n } from '@/i18n/productI18n';
import {
  useCategories,
  useFlashSale,
  useTrending,
  useNewArrivals,
  useBestSellers,
  useRecommended,
} from '@/hooks/useProducts';
import { gradients } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

export function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pi = useProductI18n();
  const categories = useCategories();
  const flash = useFlashSale();
  const trending = useTrending();
  const news = useNewArrivals();
  const best = useBestSellers();
  const reco = useRecommended();

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header + search entry */}
        <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-2">
          <Text className="text-xl font-bold text-foreground">
            Sed<Text className="text-brand-500">_</Text>Ecomm
          </Text>
          <Pressable onPress={() => nav.navigate('Search')} className="rounded-full border border-glass-border/10 bg-glass/[0.06] p-2.5">
            <Ionicons name="search" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Hero */}
        <Animated.View entering={FadeInDown.springify()} className="mx-4 mt-2 overflow-hidden rounded-3xl">
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-6" style={{ padding: 24 }}>
            <Text className="text-2xl font-bold text-white">Premium shopping,{'\n'}thoughtfully designed.</Text>
            <Pressable
              onPress={() => nav.navigate('MainTabs', { screen: 'Shop' } as never)}
              className="mt-4 self-start rounded-full bg-white px-5 py-2.5"
            >
              <Text className="font-semibold text-brand-600">{t('common.viewAll')}</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* Categories */}
        {categories.data && categories.data.length > 0 && (
          <View className="mt-6">
            <Text className="mb-3 px-4 text-lg font-semibold text-foreground">{t('home.categories')}</Text>
            <FlatList
              horizontal
              data={categories.data}
              keyExtractor={(c) => c.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => nav.navigate('MainTabs', { screen: 'Shop', params: { category: item.slug } } as never)}
                  className="w-20 items-center gap-2 rounded-2xl border border-glass-border/10 bg-glass/[0.06] p-3"
                >
                  <ProductImage uri={item.image} className="h-12 w-12 rounded-full" style={{ width: 48, height: 48, borderRadius: 24 }} />
                  <Text numberOfLines={1} className="text-xs text-secondary">{pi.category(item.name)}</Text>
                </Pressable>
              )}
            />
          </View>
        )}

        <FlashSaleRail products={flash.data} />
        <ProductRail title={t('home.trending')} products={trending.data} />
        <ProductRail title={t('home.newArrivals')} products={news.data} />
        <ProductRail title={t('home.bestSellers')} products={best.data} />
        <ProductRail title="Recommended for you" products={reco.data} />
      </ScrollView>
    </GradientBackground>
  );
}
