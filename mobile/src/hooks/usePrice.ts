import { useCurrencyStore, convertAndFormat } from '@/store/currencyStore';

/**
 * Returns a reactive price formatter bound to the selected currency. Because it
 * subscribes to the currency store, any component using it re-renders when the
 * user switches currency. Drop-in replacement for the old `formatPrice(value)`.
 */
export function usePrice() {
  const currency = useCurrencyStore((s) => s.currency);
  const rates = useCurrencyStore((s) => s.rates);
  return (value: number) => convertAndFormat(value, currency, rates);
}
