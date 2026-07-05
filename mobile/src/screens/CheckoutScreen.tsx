import { useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useAddresses, useAddAddress } from '@/hooks/useOrders';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/format';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { Address } from '@/types';

const EMPTY = { fullName: '', phone: '', line1: '', city: '', state: '', postalCode: '', country: '' };

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: addresses, isLoading } = useAddresses();
  const { data: cart } = useCart();
  const addAddress = useAddAddress();
  const [selected, setSelected] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const set = (k: keyof typeof EMPTY) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function saveAddress() {
    addAddress.mutate(form as Omit<Address, 'id'>, {
      onSuccess: (a) => {
        setSelected(a.id);
        setShowForm(false);
        setForm(EMPTY);
      },
    });
  }

  const addressId = selected ?? addresses?.find((a: Address) => a.isDefault)?.id ?? addresses?.[0]?.id;

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top }} className="flex-row items-center gap-3 px-4 py-2">
        <Pressable onPress={() => nav.goBack()} className="rounded-full border border-glass-border/10 bg-glass/[0.06] p-2">
          <Ionicons name="chevron-back" size={20} color={tc.foreground} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140, gap: 12 }}>
        <Text className="font-semibold text-foreground">Shipping address</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.brand} />
        ) : (
          addresses?.map((a: Address) => (
            <Pressable
              key={a.id}
              onPress={() => setSelected(a.id)}
              className={`rounded-2xl border p-3 ${addressId === a.id ? 'border-brand-500 bg-brand-500/10' : 'border-glass-border/10 bg-glass/[0.06]'}`}
            >
              <Text className="font-medium text-foreground">{a.fullName}</Text>
              <Text className="text-sm text-muted-foreground">
                {a.line1}, {a.city}, {a.state} {a.postalCode}, {a.country}
              </Text>
              <Text className="text-sm text-muted-foreground">{a.phone}</Text>
            </Pressable>
          ))
        )}

        {showForm ? (
          <View className="gap-3 rounded-2xl border border-glass-border/10 bg-glass/[0.06] p-3">
            <TextField label="Full name" value={form.fullName} onChangeText={set('fullName')} />
            <TextField label="Phone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
            <TextField label="Address" value={form.line1} onChangeText={set('line1')} />
            <TextField label="City" value={form.city} onChangeText={set('city')} />
            <TextField label="State" value={form.state} onChangeText={set('state')} />
            <TextField label="Postal code" value={form.postalCode} onChangeText={set('postalCode')} />
            <TextField label="Country" value={form.country} onChangeText={set('country')} />
            <Button onPress={saveAddress} loading={addAddress.isPending}>Save address</Button>
          </View>
        ) : (
          <Pressable onPress={() => setShowForm(true)} className="flex-row items-center gap-2 py-1">
            <Ionicons name="add-circle-outline" size={20} color={colors.brand} />
            <Text className="text-brand-400">Add new address</Text>
          </Pressable>
        )}

        {cart && (
          <View className="mt-2 rounded-2xl border border-glass-border/10 bg-glass/[0.06] p-4">
            <Text className="mb-2 font-semibold text-foreground">Order summary</Text>
            <View className="flex-row justify-between py-0.5"><Text className="text-muted-foreground">Subtotal</Text><Text className="text-secondary">{formatPrice(cart.subtotal)}</Text></View>
            {!!cart.discount && <View className="flex-row justify-between py-0.5"><Text className="text-emerald">Discount</Text><Text className="text-emerald">-{formatPrice(cart.discount)}</Text></View>}
            <View className="flex-row justify-between py-0.5"><Text className="text-muted-foreground">Tax</Text><Text className="text-secondary">{formatPrice(cart.tax ?? 0)}</Text></View>
            <View className="flex-row justify-between py-0.5"><Text className="text-muted-foreground">Shipping</Text><Text className="text-secondary">{cart.shippingFee ? formatPrice(cart.shippingFee) : 'Free'}</Text></View>
            <View className="mt-1 flex-row justify-between border-t border-glass-border/10 pt-2"><Text className="font-bold text-foreground">Total</Text><Text className="font-bold text-foreground">{formatPrice(cart.total)}</Text></View>
          </View>
        )}
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom + 8 }} className="absolute bottom-0 left-0 right-0 border-t border-glass-border/10 bg-surface/95 px-4 pt-3">
        <Button
          onPress={() => addressId && nav.navigate('Payment', { addressId, couponCode: cart?.couponCode })}
          disabled={!addressId}
        >
          Continue to payment
        </Button>
      </View>
    </GradientBackground>
  );
}
