import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from './GradientBackground';
import { Button } from './Button';
import type { RootStackParamList } from '@/navigation/types';

export function LoginPrompt({ message }: { message: string }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <GradientBackground>
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Ionicons name="lock-closed-outline" size={40} color="#6366F1" />
        <Text className="text-center text-lg font-medium text-foreground">{message}</Text>
        <Button onPress={() => nav.navigate('Auth', undefined)} className="w-40">
          Log in
        </Button>
      </View>
    </GradientBackground>
  );
}
