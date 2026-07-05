/** @type {import('tailwindcss').Config} */
// NativeWind v4 — Tailwind classes for React Native. Palette mirrors the web
// app's premium dark "Apple × Linear" theme (indigo/purple/cyan on near-black).
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic tokens resolve to CSS variables (global.css) so they flip
        // between light & dark when NativeWind toggles the `dark` class.
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        glass: 'rgb(var(--glass) / <alpha-value>)',
        'glass-border': 'rgb(var(--glass-border) / <alpha-value>)',
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
