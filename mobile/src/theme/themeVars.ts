import { vars } from 'nativewind';

/**
 * CSS-variable values for each theme, applied at the root <View> in App.tsx.
 * NativeWind's vars() cascades these to every descendant so the semantic
 * color tokens (bg-background, text-foreground, bg-glass, …) flip live.
 */
export const themeVars = {
  light: vars({
    '--background': '248 250 252',
    '--surface': '255 255 255',
    '--surface-2': '241 245 249',
    '--border': '226 232 240',
    '--foreground': '15 23 42',
    '--muted-foreground': '100 116 139',
    '--secondary': '51 65 85',
    '--glass': '15 23 42',
    '--glass-border': '15 23 42',
  }),
  dark: vars({
    '--background': '3 7 18',
    '--surface': '17 24 39',
    '--surface-2': '17 24 39',
    '--border': '31 41 55',
    '--foreground': '255 255 255',
    '--muted-foreground': '148 163 184',
    '--secondary': '203 213 225',
    '--glass': '255 255 255',
    '--glass-border': '255 255 255',
  }),
};
