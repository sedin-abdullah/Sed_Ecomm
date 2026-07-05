import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { GlassCard } from '@/components/GlassCard';
import { useAdminCustomers } from '@/hooks/useAdmin';
import { colors } from '@/constants/theme';
import type { User } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

export function AdminCustomersScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: customers, isLoading } = useAdminCustomers();

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1">
        <View className="flex-row items-center gap-2 px-4 pb-2">
          <Pressable onPress={() => nav.goBack()} className="h-10 w-10 items-center justify-center rounded-full bg-glass/[0.06]">
            <Ionicons name="chevron-back" size={22} color={tc.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Customers</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.brand} className="mt-10" />
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {customers?.map((c: User) => (
              <GlassCard key={c.id} className="mb-2 flex-row items-center gap-3 p-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-500/20">
                  <Text className="font-bold text-brand-400">{c.name?.[0]?.toUpperCase() ?? 'U'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-foreground">{c.name}</Text>
                  <Text className="text-xs text-muted-foreground">{c.email}</Text>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        )}
      </View>
    </GradientBackground>
  );
}
