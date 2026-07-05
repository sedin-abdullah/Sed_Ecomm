import './global.css';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { queryClient } from '@/store/queryClient';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { RootNavigator } from '@/navigation/RootNavigator';
import { registerForPushNotifications } from '@/services/notifications';
import { colors, lightColors } from '@/constants/theme';
import { themeVars } from '@/theme/themeVars';

function buildNavTheme(dark: boolean): Theme {
  const base = dark ? DarkTheme : DefaultTheme;
  const c = dark ? colors : lightColors;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: c.background,
      card: c.surface,
      text: c.foreground,
      border: c.border,
      primary: c.brand,
    },
  };
}

export default function App() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const themeHydrated = useThemeStore((s) => s.hydrated);
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const palette = isDark ? colors : lightColors;

  useEffect(() => {
    void hydrateTheme();
    void hydrateAuth();
    void registerForPushNotifications();
  }, [hydrateAuth, hydrateTheme]);

  const ready = authHydrated && themeHydrated;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <View style={[{ flex: 1 }, themeVars[theme]]}>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              {ready ? (
                <NavigationContainer theme={buildNavTheme(isDark)}>
                  <RootNavigator />
                </NavigationContainer>
              ) : (
                <View style={{ flex: 1, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator color={palette.brand} size="large" />
                </View>
              )}
            </View>
          </QueryClientProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
