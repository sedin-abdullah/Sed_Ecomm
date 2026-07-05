import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { TabParamList } from './types';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useUiStore } from '@/store/uiStore';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProductsScreen } from '@/screens/ProductsScreen';
import { CartScreen } from '@/screens/CartScreen';
import { WishlistScreen } from '@/screens/WishlistScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View className="absolute -right-2 -top-1 h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1">
      <Text className="text-[9px] font-bold text-white">{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

export function TabNavigator() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const cartCount = useUiStore((s) => s.cartCount);
  const wishlistCount = useUiStore((s) => s.wishlistCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('nav.home'), tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Shop"
        component={ProductsScreen}
        options={{ title: t('nav.shop'), tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          title: t('nav.wishlist'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="heart-outline" color={color} size={size} />
              <Badge count={wishlistCount} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: t('nav.cart'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="bag-outline" color={color} size={size} />
              <Badge count={cartCount} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('nav.profile'), tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
