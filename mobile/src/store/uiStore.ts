import { create } from 'zustand';

/** Lightweight badge counts for the tab bar (cart / wishlist), kept in sync by the query hooks. */
interface UiState {
  cartCount: number;
  wishlistCount: number;
  setCartCount: (n: number) => void;
  setWishlistCount: (n: number) => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartCount: 0,
  wishlistCount: 0,
  setCartCount: (cartCount) => set({ cartCount }),
  setWishlistCount: (wishlistCount) => set({ wishlistCount }),
}));
