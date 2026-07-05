import { useState } from 'react';
import { Image } from 'expo-image';
import { View, Text } from 'react-native';
import type { ImageStyle, StyleProp } from 'react-native';

const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

/** Optimized product image (expo-image caching + blurhash) with a fallback. */
export function ProductImage({ uri, style, className }: { uri?: string; style?: StyleProp<ImageStyle>; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return (
      <View className={`items-center justify-center bg-white/5 ${className ?? ''}`} style={style as never}>
        <Text className="text-xs text-muted-foreground">No image</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      className={className}
      placeholder={BLUR_HASH}
      contentFit="cover"
      transition={250}
      cachePolicy="memory-disk"
      onError={() => setFailed(true)}
    />
  );
}
