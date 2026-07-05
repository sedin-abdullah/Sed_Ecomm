import { QueryClient } from '@tanstack/react-query';

// Short stale window + refetch-on-focus keeps catalog/cart data reasonably
// live against the shared backend without extra infrastructure (mirrors web).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
