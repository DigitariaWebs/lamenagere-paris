import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { persistStorage } from "../../lib/persist-storage";

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorited: (productId: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (productId) => {
        const { favorites } = get();
        if (favorites.includes(productId)) {
          set({ favorites: favorites.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }
      },

      addFavorite: (productId) => {
        const { favorites } = get();
        if (!favorites.includes(productId)) {
          set({ favorites: [...favorites, productId] });
        }
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        }));
      },

      isFavorited: (productId) => {
        return get().favorites.includes(productId);
      },

      clear: () => set({ favorites: [] }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => persistStorage),
    },
  ),
);
