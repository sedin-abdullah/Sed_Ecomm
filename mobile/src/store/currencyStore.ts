import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'AED' | 'CNY' | 'JPY' | 'GBP';

const STORAGE_KEY = 'app-currency';

/** Static fallback rates (units of currency per 1 USD) if the live-rate call fails. */
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.2,
  EUR: 0.92,
  AED: 3.67,
  CNY: 7.24,
  JPY: 156.5,
  GBP: 0.79,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  AED: 'AED ',
  CNY: '¥',
  JPY: '¥',
  GBP: '£',
};

export const CURRENCIES = Object.keys(FALLBACK_RATES) as CurrencyCode[];

interface CurrencyState {
  currency: CurrencyCode;
  rates: Record<string, number>;
  hydrated: boolean;
  setCurrency: (c: CurrencyCode) => void;
  hydrate: () => Promise<void>;
  fetchRates: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: 'USD',
  rates: FALLBACK_RATES,
  hydrated: false,
  setCurrency: (currency) => {
    void SecureStore.setItemAsync(STORAGE_KEY, currency);
    set({ currency });
  },
  hydrate: async () => {
    let currency: CurrencyCode = 'USD';
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored && (CURRENCIES as string[]).includes(stored)) currency = stored as CurrencyCode;
    } catch {
      // keep USD
    }
    set({ currency, hydrated: true });
  },
  fetchRates: async () => {
    try {
      const res = await api.get('/meta/currency-rates');
      const rates = res.data?.data?.rates as Record<string, number> | undefined;
      if (rates && Object.keys(rates).length > 0) {
        set({ rates: { ...FALLBACK_RATES, ...rates } });
      }
    } catch {
      // fall back to static rates
    }
  },
}));

/** Converts a USD amount to the given currency and formats it with the right symbol. */
export function convertAndFormat(amountUSD: number, currency: CurrencyCode, rates: Record<string, number>): string {
  const rate = rates[currency] ?? FALLBACK_RATES[currency] ?? 1;
  const converted = amountUSD * rate;
  const fractionDigits = currency === 'JPY' ? 0 : 2;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(converted);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] ?? '';
    return `${symbol}${converted.toFixed(fractionDigits)}`;
  }
}
