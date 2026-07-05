import { useState } from 'react';
import { ScrollView, View, Text, Pressable, Modal, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { useThemeColors } from '@/hooks/useThemeColors';
import { GlassCard } from '@/components/GlassCard';
import { ProductImage } from '@/components/ProductImage';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useAdmin';
import { useCategories } from '@/hooks/useProducts';
import { getApiErrorMessage } from '@/services/api';
import { formatPrice } from '@/utils/format';
import { colors } from '@/constants/theme';
import type { Category, Product } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

const FLAGS = [
  { key: 'isFeatured', label: 'Featured' },
  { key: 'isFlashSale', label: 'Flash Sale' },
  { key: 'isNewArrival', label: 'New Arrival' },
  { key: 'isBestSeller', label: 'Best Seller' },
] as const;

type FlagKey = (typeof FLAGS)[number]['key'];

const categoryIdOf = (p: Product) => (typeof p.category === 'string' ? p.category : p.category?.id);

export function AdminProductsScreen() {
  const insets = useSafeAreaInsets();
  const tc = useThemeColors();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: products, isLoading } = useAdminProducts();
  const { data: categories } = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [f, setF] = useState({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '' });
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({ isFeatured: false, isFlashSale: false, isNewArrival: false, isBestSeller: false });

  function openCreate() {
    setEditing(null);
    setF({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '' });
    setFlags({ isFeatured: false, isFlashSale: false, isNewArrival: false, isBestSeller: false });
    setOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setF({
      name: p.name,
      description: p.description,
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : '',
      stock: String(p.stock),
      category: categoryIdOf(p) ?? '',
      brand: p.brand ?? '',
    });
    setFlags({
      isFeatured: !!p.isFeatured,
      isFlashSale: !!p.isFlashSale,
      isNewArrival: !!p.isNewArrival,
      isBestSeller: !!p.isBestSeller,
    });
    setOpen(true);
  }

  function submit() {
    if (!f.name.trim() || !f.category || !f.price) return Alert.alert('Missing info', 'Name, category and price are required.');
    if (f.description.trim().length < 10) return Alert.alert('Description too short', 'Use at least 10 characters.');
    const input = {
      name: f.name,
      description: f.description,
      price: Number(f.price),
      discountPrice: f.discountPrice ? Number(f.discountPrice) : undefined,
      stock: f.stock ? Number(f.stock) : 0,
      category: f.category,
      brand: f.brand || undefined,
      ...flags,
    };
    const onError = (e: unknown) => Alert.alert('Error', getApiErrorMessage(e));
    if (editing) update.mutate({ id: editing.id, input }, { onSuccess: () => setOpen(false), onError });
    else create.mutate(input, { onSuccess: () => setOpen(false), onError });
  }

  function confirmDelete(p: Product) {
    Alert.alert('Delete product', `Delete "${p.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => del.mutate(p.id, { onError: (e) => Alert.alert('Error', getApiErrorMessage(e)) }) },
    ]);
  }

  return (
    <GradientBackground>
      <View style={{ paddingTop: insets.top + 8 }} className="flex-1">
        <View className="flex-row items-center gap-2 px-4 pb-2">
          <Pressable onPress={() => nav.goBack()} className="h-10 w-10 items-center justify-center rounded-full bg-glass/[0.06]">
            <Ionicons name="chevron-back" size={22} color={tc.foreground} />
          </Pressable>
          <Text className="flex-1 text-2xl font-bold text-foreground">Products</Text>
          <Pressable onPress={openCreate} className="rounded-full bg-brand-500 px-4 py-2">
            <Text className="font-semibold text-white">+ Add</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.brand} className="mt-10" />
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {products?.map((p: Product) => (
              <GlassCard key={p.id} className="mb-3 flex-row items-center gap-3 p-3">
                <ProductImage uri={p.images?.[0]?.url} style={{ width: 48, height: 48, borderRadius: 10 }} />
                <View className="flex-1">
                  <Text className="text-foreground" numberOfLines={1}>{p.name}</Text>
                  <Text className="text-xs text-muted-foreground">{formatPrice(p.discountPrice ?? p.price)} · stock {p.stock}</Text>
                </View>
                <Pressable onPress={() => openEdit(p)} className="p-2">
                  <Ionicons name="create-outline" size={20} color={colors.muted} />
                </Pressable>
                <Pressable onPress={() => confirmDelete(p)} className="p-2">
                  <Ionicons name="trash-outline" size={20} color={colors.sale} />
                </Pressable>
              </GlassCard>
            ))}
          </ScrollView>
        )}
      </View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="max-h-[88%] rounded-t-3xl border border-glass-border/10 bg-surface-2 p-4" style={{ paddingBottom: insets.bottom + 16 }}>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground">{editing ? 'Edit product' : 'Add product'}</Text>
              <Pressable onPress={() => setOpen(false)}><Ionicons name="close" size={24} color={colors.muted} /></Pressable>
            </View>
            <ScrollView>
              <View className="gap-3">
                <TextField label="Name" value={f.name} onChangeText={(v) => setF({ ...f, name: v })} />
                <TextField label="Description (min 10 chars)" value={f.description} onChangeText={(v) => setF({ ...f, description: v })} multiline />
                <TextField label="Price (USD)" value={f.price} onChangeText={(v) => setF({ ...f, price: v })} keyboardType="numeric" />
                <TextField label="Discount price (optional)" value={f.discountPrice} onChangeText={(v) => setF({ ...f, discountPrice: v })} keyboardType="numeric" />
                <TextField label="Stock" value={f.stock} onChangeText={(v) => setF({ ...f, stock: v })} keyboardType="numeric" />
                <TextField label="Brand (optional)" value={f.brand} onChangeText={(v) => setF({ ...f, brand: v })} />

                <Text className="text-sm font-medium text-secondary">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {categories?.map((c: Category) => {
                    const active = f.category === c.id;
                    return (
                      <Pressable key={c.id} onPress={() => setF({ ...f, category: c.id })}
                        className={`rounded-full border px-3 py-1.5 ${active ? 'border-brand-500 bg-brand-500/20' : 'border-glass-border/10'}`}>
                        <Text className={active ? 'text-brand-400' : 'text-secondary'}>{c.name}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text className="text-sm font-medium text-secondary">Flags</Text>
                <View className="flex-row flex-wrap gap-2">
                  {FLAGS.map((fl) => {
                    const active = flags[fl.key];
                    return (
                      <Pressable key={fl.key} onPress={() => setFlags({ ...flags, [fl.key]: !active })}
                        className={`rounded-full border px-3 py-1.5 ${active ? 'border-brand-500 bg-brand-500/20' : 'border-glass-border/10'}`}>
                        <Text className={active ? 'text-brand-400' : 'text-secondary'}>{fl.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Button onPress={submit} loading={create.isPending || update.isPending} className="mt-2">
                  {editing ? 'Save changes' : 'Create product'}
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}
