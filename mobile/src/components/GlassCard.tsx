import { View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';

/** Translucent glass surface — the mobile equivalent of the web <Card />. */
export function GlassCard({ children, className = '', ...props }: ViewProps & { children: ReactNode; className?: string }) {
  return (
    <View
      className={`rounded-3xl border border-white/10 bg-white/[0.06] ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
