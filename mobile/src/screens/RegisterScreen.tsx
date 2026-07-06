import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { AuthShell } from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useRegister } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/services/api';
import type { AuthStackParamList } from '@/navigation/types';

export function RegisterScreen() {
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const register = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    if (name.trim().length < 2 || password.length < 8) {
      Alert.alert('Check your details', 'Name is required and password must be at least 8 characters.');
      return;
    }
    register.mutate(
      { name: name.trim(), email: email.trim(), password },
      {
        onSuccess: () => nav.getParent()?.goBack(),
        onError: (e) => Alert.alert('Sign up failed', getApiErrorMessage(e)),
      },
    );
  }

  return (
    <AuthShell title={t('auth.register')}>
      <View className="gap-4">
        <TextField label={t('auth.name')} value={name} onChangeText={setName} placeholder="Jane Doe" />
        <TextField label={t('auth.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <TextField label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 8 characters" />
        <Button onPress={submit} loading={register.isPending}>
          {t('auth.register')}
        </Button>
        <Pressable onPress={() => nav.navigate('Login')} className="mt-2 flex-row justify-center gap-1">
          <Text className="text-muted-foreground">{t('auth.haveAccount')}</Text>
          <Text className="font-semibold text-brand-400">{t('auth.login')}</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}
