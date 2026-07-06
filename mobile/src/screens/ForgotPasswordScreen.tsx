import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthShell } from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useForgotPassword } from '@/hooks/useAuth';

export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const nav = useNavigation();
  const forgot = useForgotPassword();
  const [email, setEmail] = useState('');

  function submit() {
    forgot.mutate(email.trim(), {
      onSuccess: () => {
        Alert.alert('Check your email', 'If an account exists, a reset link has been sent.');
        nav.goBack();
      },
    });
  }

  return (
    <AuthShell title={t('auth.forgot')}>
      <Text className="mb-4 text-muted-foreground">Enter your email and we'll send a reset link.</Text>
      <View className="gap-4">
        <TextField label={t('auth.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Button onPress={submit} loading={forgot.isPending}>
          Send reset link
        </Button>
        <Pressable onPress={() => nav.goBack()} className="mt-2 items-center">
          <Text className="text-brand-400">Back to login</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}
