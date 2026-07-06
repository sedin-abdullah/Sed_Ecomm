import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { AuthShell } from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useLogin } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/services/api';
import type { AuthStackParamList } from '@/navigation/types';

export function LoginScreen() {
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    login.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => nav.getParent()?.goBack(),
        onError: (e) => Alert.alert('Login failed', getApiErrorMessage(e, 'Invalid credentials')),
      },
    );
  }

  return (
    <AuthShell title={t('auth.login')}>
      <View className="gap-4">
        <TextField
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
        />
        <TextField label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

        <Pressable onPress={() => nav.navigate('Forgot')} className="self-end">
          <Text className="text-sm text-brand-400">{t('auth.forgot')}</Text>
        </Pressable>

        <Button onPress={submit} loading={login.isPending}>
          {t('auth.login')}
        </Button>

        <Pressable onPress={() => nav.navigate('Register')} className="mt-2 flex-row justify-center gap-1">
          <Text className="text-muted-foreground">{t('auth.noAccount')}</Text>
          <Text className="font-semibold text-brand-400">{t('auth.register')}</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}
