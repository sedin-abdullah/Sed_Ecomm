import { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { usePlaceOrder } from '@/hooks/useOrders';
import { initiatePayment, verifyPayment } from '@/services/orders';
import { getApiErrorMessage } from '@/services/api';
import { DEMO } from '@/constants/config';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { PaymentMethod } from '@/types';

const METHODS: { key: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'card_credit', label: 'Credit Card', icon: 'card-outline' },
  { key: 'card_debit', label: 'Debit Card', icon: 'card' },
  { key: 'upi', label: 'UPI', icon: 'qr-code-outline' },
  { key: 'netbanking', label: 'Net Banking', icon: 'business-outline' },
  { key: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
  { key: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
];

type Stage = 'form' | 'otp' | 'success';

export function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Payment'>>();
  const placeOrder = usePlaceOrder();

  const [method, setMethod] = useState<PaymentMethod>('card_credit');
  const [stage, setStage] = useState<Stage>('form');
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState<string>();
  const [paymentId, setPaymentId] = useState<string>();
  const [otp, setOtp] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  function detailsFor(m: PaymentMethod): Record<string, string> {
    if (m === 'card_credit' || m === 'card_debit') return { cardNumber: card.number, expiry: card.expiry, cvv: card.cvv, name: card.name };
    if (m === 'upi') return { vpa: 'demo@upi' };
    if (m === 'netbanking') return { bankCode: 'HDFC' };
    if (m === 'wallet') return { walletProvider: 'paytm' };
    return {};
  }

  async function pay() {
    setBusy(true);
    try {
      const order = await placeOrder.mutateAsync({ addressId: params.addressId, couponCode: params.couponCode, paymentMethod: method });
      setOrderId(order.id);
      const init = await initiatePayment(order.id, method, detailsFor(method));
      setPaymentId(init.paymentId);
      if (init.requiresOtp) setStage('otp');
      else setStage('success');
    } catch (e) {
      Alert.alert('Payment failed', getApiErrorMessage(e, 'Could not place your order'));
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!paymentId) return;
    setBusy(true);
    try {
      await verifyPayment(paymentId, otp);
      setStage('success');
    } catch (e) {
      Alert.alert('Verification failed', getApiErrorMessage(e, 'Incorrect OTP'));
    } finally {
      setBusy(false);
    }
  }

  if (stage === 'success') {
    return (
      <GradientBackground>
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Animated.View entering={ZoomIn.springify()}>
            <Ionicons name="checkmark-circle" size={88} color={colors.emerald} />
          </Animated.View>
          <Text className="text-2xl font-bold text-foreground">{t('payment.success')}</Text>
          <Text className="text-center text-muted-foreground">Your order has been confirmed.</Text>
          <View className="mt-4 w-full gap-3">
            <Button onPress={() => orderId && nav.replace('OrderDetail', { id: orderId })}>View order</Button>
            <Button variant="glass" onPress={() => nav.navigate('MainTabs', { screen: 'Home' } as never)}>Continue shopping</Button>
          </View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top }} className="flex-row items-center gap-3 px-4 py-2">
        <Pressable onPress={() => nav.goBack()} className="rounded-full border border-glass-border/10 bg-glass/[0.06] p-2">
          <Ionicons name="chevron-back" size={20} color={tc.foreground} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">{stage === 'otp' ? t('payment.success') : 'Payment'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        {stage === 'form' ? (
          <>
            <Text className="font-semibold text-foreground">Choose a payment method</Text>
            <View className="flex-row flex-wrap gap-2">
              {METHODS.map((m) => (
                <Pressable
                  key={m.key}
                  onPress={() => setMethod(m.key)}
                  style={{ width: '31%' }}
                  className={`items-center gap-1 rounded-2xl border p-3 ${method === m.key ? 'border-brand-500 bg-brand-500/15' : 'border-glass-border/10 bg-glass/[0.06]'}`}
                >
                  <Ionicons name={m.icon} size={22} color={method === m.key ? colors.brand : colors.muted} />
                  <Text className={`text-center text-[11px] ${method === m.key ? 'text-brand-400' : 'text-muted-foreground'}`}>{m.label}</Text>
                </Pressable>
              ))}
            </View>

            {(method === 'card_credit' || method === 'card_debit') && (
              <View className="gap-3">
                <TextField label="Card number" value={card.number} onChangeText={(v) => setCard((c) => ({ ...c, number: v }))} keyboardType="number-pad" placeholder={DEMO.card.number} />
                <View className="flex-row gap-3">
                  <View className="flex-1"><TextField label="Expiry" value={card.expiry} onChangeText={(v) => setCard((c) => ({ ...c, expiry: v }))} placeholder={DEMO.card.expiry} /></View>
                  <View className="flex-1"><TextField label="CVV" value={card.cvv} onChangeText={(v) => setCard((c) => ({ ...c, cvv: v }))} keyboardType="number-pad" placeholder={DEMO.card.cvv} /></View>
                </View>
                <TextField label="Name on card" value={card.name} onChangeText={(v) => setCard((c) => ({ ...c, name: v }))} />
              </View>
            )}
            {method === 'cod' && <Text className="text-muted-foreground">Pay with cash when your order arrives.</Text>}

            <Button onPress={pay} loading={busy}>{t('payment.payNow')}</Button>
          </>
        ) : (
          <>
            <Text className="text-muted-foreground">Enter the OTP sent to your number. <Text className="font-bold text-foreground">Demo OTP: {DEMO.otp}</Text></Text>
            <TextField label="OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="123456" />
            <Button onPress={verify} loading={busy}>Verify & Pay</Button>
          </>
        )}
      </ScrollView>
    </GradientBackground>
  );
}
