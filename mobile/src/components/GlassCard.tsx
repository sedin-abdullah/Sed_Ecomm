import { View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';

/** Translucent glass surface — the mobile equivalent of the web <Card />. */
export function GlassCard({ children, className = '', ...props }: ViewProps & { children: ReactNode; className?: string }) {
  return (
    <View
      className={`rounded-3xl border border-glass-border/10 bg-glass/[0.06] ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
