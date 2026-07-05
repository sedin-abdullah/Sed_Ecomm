import { useState } from 'react';
import { View, Text, Pressable, FlatList, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '@/components/GradientBackground';
import { ProductImage } from '@/components/ProductImage';
import { useSuggestions } from '@/hooks/useProducts';
import { useProductI18n } from '@/i18n/productI18n';
import { useDebounce } from '@/hooks/useDebounce';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

const TRENDING = ['Sneakers', 'Watch', 'Perfume', 'Jeans', 'Headphones'];

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pi = useProductI18n();
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 300);
  const { data: suggestions } = useSuggestions(debounced);

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1 px-4">
        <View className="flex-row items-center gap-2">
          <View className="h-12 flex-1 flex-row items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3">
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              autoFocus
              value={q}
              onChangeText={setQ}
              placeholder={t('common.search')}
              placeholderTextColor={colors.muted}
              className="flex-1 text-base text-foreground"
            />
          </View>
          <Pressable onPress={() => nav.goBack()}>
            <Text className="text-brand-400">Cancel</Text>
          </Pressable>
        </View>

        {debounced.trim().length < 2 ? (
          <View className="mt-6">
            <Text className="mb-3 font-semibold text-foreground">Trending searches</Text>
            <View className="flex-row flex-wrap gap-2">
              {TRENDING.map((term) => (
                <Pressable key={term} onPress={() => setQ(term)} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">
                  <Text className="text-secondary">{term}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(s) => s.id}
            className="mt-3"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text className="mt-8 text-center text-muted-foreground">No matches</Text>}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => nav.replace('ProductDetail', { slug: item.slug })}
                className="flex-row items-center gap-3 border-b border-white/5 py-3"
              >
                <ProductImage uri={item.image} className="h-10 w-10 rounded-lg" style={{ width: 40, height: 40, borderRadius: 8 }} />
                <Text className="text-foreground">{pi.rawName(item.name)}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </GradientBackground>
  );
}
