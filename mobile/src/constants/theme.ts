/**
 * Premium dark "Apple × Linear" palette, matching the web app. Used for
 * inline styles (gradients, shadows) where NativeWind classes aren't ideal.
 */
export const colors = {
  background: '#030712',
  backgroundMid: '#0B1120',
  surface: '#111827',
  glass: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.10)',
  border: '#1F2937',
  foreground: '#FFFFFF',
  secondary: '#CBD5E1',
  muted: '#94A3B8',
  brand: '#6366F1',
  purple: '#8B5CF6',
  cyan: '#22D3EE',
  blue: '#3B82F6',
  emerald: '#10B981',
  sale: '#EF4444',
  gold: '#F59E0B',
};

export const gradients = {
  brand: ['#6366F1', '#8B5CF6'] as const,
  accent: ['#22D3EE', '#3B82F6'] as const,
  background: ['#030712', '#0B1120', '#111827'] as const,
};

export const radius = { sm: 10, md: 16, lg: 20, xl: 28, full: 9999 };
