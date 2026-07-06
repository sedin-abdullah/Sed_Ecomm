import { useCurrencyStore, convertAndFormat } from '@/store/currencyStore';

/**
 * Formats a USD amount in the currently-selected currency. Reads the store
 * imperatively so it works outside React; components that must re-render on a
 * currency change should use the reactive `usePrice()` hook instead.
 */
export function formatPrice(value: number): string {
  const { currency, rates } = useCurrencyStore.getState();
  return convertAndFormat(value, currency, rates);
}
