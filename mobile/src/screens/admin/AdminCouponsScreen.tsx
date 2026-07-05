import { useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { GlassCard } from '@/components/GlassCard';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useAdmin';
import type { Coupon } from '@/services/admin';
import { getApiErrorMessage } from '@/services/api';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

export function AdminCouponsScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: coupons, isLoading } = useAdminCoupons();
  const create = useCreateCoupon();
  const toggle = useUpdateCoupon();
  const del = useDeleteCoupon();

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  function submit() {
    if (!code.trim() || !value || !expiresAt.trim()) {
      return Alert.alert('Missing info', 'Code, value and expiry date (YYYY-MM-DD) are required.');
    }
    create.mutate(
      { code: code.toUpperCase(), type, value: Number(value), expiresAt },
      {
        onSuccess: () => { setCode(''); setValue(''); setExpiresAt(''); },
        onError: (e) => Alert.alert('Error', getApiErrorMessage(e)),
      },
    );
  }

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1">
        <View className="flex-row items-center gap-2 px-4 pb-2">
          <Pressable onPress={() => nav.goBack()} className="h-10 w-10 items-center justify-center rounded-full bg-glass/[0.06]">
            <Ionicons name="chevron-back" size={22} color={tc.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Coupons</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <GlassCard className="mb-4 gap-3 p-4">
            <TextField label="Code" value={code} onChangeText={setCode} autoCapitalize="characters" />
            <View className="flex-row gap-2">
              {(['percentage', 'flat'] as const).map((tp) => (
                <Pressable key={tp} onPress={() => setType(tp)}
                  className={`flex-1 items-center rounded-2xl border py-3 ${type === tp ? 'border-brand-500 bg-brand-500/20' : 'border-glass-border/10'}`}>
                  <Text className={type === tp ? 'text-brand-400' : 'text-secondary'}>{tp}</Text>
                </Pressable>
              ))}
            </View>
            <TextField label="Value (% or $)" value={value} onChangeText={setValue} keyboardType="numeric" />
            <TextField label="Expires at (YYYY-MM-DD)" value={expiresAt} onChangeText={setExpiresAt} placeholder="2026-12-31" />
            <Button onPress={submit} loading={create.isPending}>Add coupon</Button>
          </GlassCard>

          {isLoading ? (
            <ActivityIndicator color={colors.brand} />
          ) : (
            coupons?.map((c: Coupon) => (
              <GlassCard key={c.id} className="mb-2 flex-row items-center gap-3 p-3">
                <View className="flex-1">
                  <Text className="font-mono font-medium text-foreground">{c.code}</Text>
                  <Text className="text-xs text-muted-foreground">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</Text>
                </View>
                <Pressable onPress={() => toggle.mutate({ id: c.id, patch: { isActive: !c.isActive } })}
                  className="rounded-full border border-glass-border/[0.15] px-3 py-1">
                  <Text className={`text-xs ${c.isActive ? 'text-emerald' : 'text-muted-foreground'}`}>{c.isActive ? 'Active' : 'Disabled'}</Text>
                </Pressable>
                <Pressable onPress={() => del.mutate(c.id)} className="p-1"><Ionicons name="trash-outline" size={18} color={colors.sale} /></Pressable>
              </GlassCard>
            ))
          )}
        </ScrollView>
      </View>
    </GradientBackground>
  );
}
