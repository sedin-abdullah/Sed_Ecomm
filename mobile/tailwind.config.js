/** @type {import('tailwindcss').Config} */
// NativeWind v4 — Tailwind classes for React Native. Palette mirrors the web
// app's premium dark "Apple × Linear" theme (indigo/purple/cyan on near-black).
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#030712',
        surface: '#0B1120',
        'surface-2': '#111827',
        border: '#1F2937',
        foreground: '#FFFFFF',
        'muted-foreground': '#94A3B8',
        secondary: '#CBD5E1',
        brand: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#5457E5',
          700: '#4F46E5',
        },
        purple: '#8B5CF6',
        cyan: '#22D3EE',
        blue: '#3B82F6',
        emerald: '#10B981',
        sale: '#EF4444',
        gold: '#F59E0B',
      },
    },
  },
  plugins: [],
};
